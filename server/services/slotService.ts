import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlotHold {
  clientId: string;
  heldAt: number;  // timestamp ms
}

// slotKey = "YYYY-MM-DD|HH:MM AM|1,2,10"  (testIds numerically sorted)
type SlotKey = string;

// ── In-memory state ───────────────────────────────────────────────────────────
// Maps slotKey → holds currently active on that slot
const slotHolds = new Map<SlotKey, SlotHold[]>();

// Maps clientId → Set of slot keys that client is holding
const clientSlots = new Map<string, Set<SlotKey>>();

// Maps clientId → live WebSocket
const clients = new Map<string, WebSocket>();

// Holds expire after 10 min of silence (guards against silent disconnects)
const HOLD_TTL_MS = 10 * 60 * 1000;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * FIX #1 — Use numeric comparator so [1,10,2] → "1,2,10" not "1,10,2".
 * Without this, two clients selecting the same tests in a different order
 * would generate different slot keys and never see each other's holds.
 */
export function makeSlotKey(date: string, timeSlot: string, testIds: number[]): SlotKey {
  return `${date}|${timeSlot}|${[...testIds].sort((a, b) => a - b).join(',')}`;
}

/**
 * FIX #2 — cleanExpiredHolds also removes stale entries from clientSlots.
 * Previously expired holds were removed from slotHolds but the clientId
 * remained in clientSlots forever → memory leak on long-running servers.
 */
function cleanExpiredHolds(slotKey: SlotKey): void {
  const holds = slotHolds.get(slotKey);
  if (!holds) return;

  const now     = Date.now();
  const expired = holds.filter((h) => now - h.heldAt >= HOLD_TTL_MS);
  const valid   = holds.filter((h) => now - h.heldAt <  HOLD_TTL_MS);

  // Clean up clientSlots for expired holds
  for (const { clientId } of expired) {
    const mySlots = clientSlots.get(clientId);
    if (mySlots) {
      mySlots.delete(slotKey);
      if (mySlots.size === 0) clientSlots.delete(clientId);
    }
  }

  if (valid.length === 0) {
    slotHolds.delete(slotKey);
  } else {
    slotHolds.set(slotKey, valid);
  }
}

function getHoldCount(slotKey: SlotKey): number {
  cleanExpiredHolds(slotKey);
  return slotHolds.get(slotKey)?.length ?? 0;
}

function broadcastSlotStatus(slotKey: SlotKey): void {
  const holdCount = getHoldCount(slotKey);
  const payload = JSON.stringify({
    type: 'slot_status',
    slotKey,
    holdCount,
    isHeld: holdCount > 0,
  });

  for (const [, ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

/**
 * FIX #3 — addHold no longer calls releaseHold first.
 * The old code did: releaseHold() [broadcasts] → push new hold → broadcastSlotStatus()
 * That caused 2 broadcasts every time a client held a slot.
 * Now we just replace the existing hold entry inline (single broadcast).
 */
function addHold(clientId: string, slotKey: SlotKey): void {
  const existing = slotHolds.get(slotKey) ?? [];
  // Replace any existing hold for this client (avoids duplicate entries)
  const without  = existing.filter((h) => h.clientId !== clientId);
  without.push({ clientId, heldAt: Date.now() });
  slotHolds.set(slotKey, without);

  const mySlots = clientSlots.get(clientId) ?? new Set<SlotKey>();
  mySlots.add(slotKey);
  clientSlots.set(clientId, mySlots);

  broadcastSlotStatus(slotKey); // exactly ONE broadcast
}

function releaseHold(clientId: string, slotKey: SlotKey): void {
  const holds = slotHolds.get(slotKey);
  if (!holds) return;

  const filtered = holds.filter((h) => h.clientId !== clientId);
  if (filtered.length === 0) {
    slotHolds.delete(slotKey);
  } else {
    slotHolds.set(slotKey, filtered);
  }

  const mySlots = clientSlots.get(clientId);
  if (mySlots) {
    mySlots.delete(slotKey);
    if (mySlots.size === 0) clientSlots.delete(clientId);
  }

  broadcastSlotStatus(slotKey);
}

function releaseAllHolds(clientId: string): void {
  const mySlots = clientSlots.get(clientId);
  if (!mySlots) return;

  for (const slotKey of mySlots) {
    const holds = slotHolds.get(slotKey);
    if (!holds) continue;
    const filtered = holds.filter((h) => h.clientId !== clientId);
    if (filtered.length === 0) {
      slotHolds.delete(slotKey);
    } else {
      slotHolds.set(slotKey, filtered);
    }
    broadcastSlotStatus(slotKey);
  }

  clientSlots.delete(clientId);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * FIX #4 — markSlotBooked now clears all holds for the slot before broadcasting.
 * Previously the slot remained in slotHolds after booking, so late-arriving
 * clients would still see it as "held" (wrong) instead of "booked".
 */
export function markSlotBooked(slotKey: SlotKey): void {
  // Clear all holds for this slot and tidy clientSlots
  const holds = slotHolds.get(slotKey) ?? [];
  for (const { clientId } of holds) {
    const mySlots = clientSlots.get(clientId);
    if (mySlots) {
      mySlots.delete(slotKey);
      if (mySlots.size === 0) clientSlots.delete(clientId);
    }
  }
  slotHolds.delete(slotKey);

  // Broadcast the definitive "booked" event to every connected client
  const payload = JSON.stringify({ type: 'slot_booked', slotKey, isBooked: true });
  for (const [, ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

/** Returns how many clients are currently holding a given slot. */
export function getSlotHoldCount(slotKey: SlotKey): number {
  return getHoldCount(slotKey);
}

// ── WebSocket Server Setup ────────────────────────────────────────────────────
let counter = 0;
function newClientId(): string {
  return `c_${Date.now()}_${++counter}`;
}

export function setupSlotWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/slots' });

  wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
    const clientId = newClientId();
    clients.set(clientId, ws);

    // Greet the client with their assigned ID
    ws.send(JSON.stringify({ type: 'connected', clientId }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case 'hold_slot': {
            const key = makeSlotKey(msg.date, msg.timeSlot, msg.testIds);
            addHold(clientId, key);
            // Acknowledge with current hold count (client uses this to show warning)
            ws.send(JSON.stringify({
              type: 'hold_ack',
              slotKey: key,
              holdCount: getHoldCount(key),
            }));
            break;
          }

          case 'release_slot': {
            const key = makeSlotKey(msg.date, msg.timeSlot, msg.testIds);
            releaseHold(clientId, key);
            break;
          }

          case 'check_slot': {
            const key = makeSlotKey(msg.date, msg.timeSlot, msg.testIds);
            const holdCount = getHoldCount(key);
            ws.send(JSON.stringify({
              type: 'slot_status',
              slotKey: key,
              holdCount,
              isHeld: holdCount > 0,
            }));
            break;
          }

          default:
            break;
        }
      } catch {
        // Ignore malformed / non-JSON messages
      }
    });

    ws.on('close', () => {
      releaseAllHolds(clientId);
      clients.delete(clientId);
    });

    ws.on('error', () => {
      releaseAllHolds(clientId);
      clients.delete(clientId);
    });
  });

  console.log('✅ Slot WebSocket server active at /ws/slots');
  return wss;
}
