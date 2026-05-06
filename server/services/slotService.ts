import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { Server } from 'http';

// ── Types ─────────────────────────────────────────────────────────────────────
interface SlotHold {
  clientId: string;
  heldAt: number;  // timestamp
}

// slotKey = "YYYY-MM-DD|HH:MM AM|testId1,testId2"
type SlotKey = string;

// ── In-memory Slot Holds ──────────────────────────────────────────────────────
// Maps slotKey → array of active holds (one per connected client that selected it)
const slotHolds = new Map<SlotKey, SlotHold[]>();

// Maps clientId → Set of slot keys they currently hold
const clientSlots = new Map<string, Set<SlotKey>>();

// Maps clientId → WebSocket instance (for direct messaging)
const clients = new Map<string, WebSocket>();

// Hold expires after 10 minutes of inactivity (in case client disconnects silently)
const HOLD_TTL_MS = 10 * 60 * 1000;

// ── Helpers ───────────────────────────────────────────────────────────────────
export function makeSlotKey(date: string, timeSlot: string, testIds: number[]): SlotKey {
  return `${date}|${timeSlot}|${[...testIds].sort().join(',')}`;
}

function getHoldCount(slotKey: SlotKey): number {
  cleanExpiredHolds(slotKey);
  return slotHolds.get(slotKey)?.length ?? 0;
}

function cleanExpiredHolds(slotKey: SlotKey) {
  const holds = slotHolds.get(slotKey);
  if (!holds) return;
  const now = Date.now();
  const valid = holds.filter((h) => now - h.heldAt < HOLD_TTL_MS);
  if (valid.length === 0) {
    slotHolds.delete(slotKey);
  } else {
    slotHolds.set(slotKey, valid);
  }
}

function broadcastSlotStatus(slotKey: SlotKey) {
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

function addHold(clientId: string, slotKey: SlotKey) {
  // Remove any previous hold this client had for this same slot
  releaseHold(clientId, slotKey);

  const holds = slotHolds.get(slotKey) ?? [];
  holds.push({ clientId, heldAt: Date.now() });
  slotHolds.set(slotKey, holds);

  // Track which slots this client holds
  const mySlots = clientSlots.get(clientId) ?? new Set();
  mySlots.add(slotKey);
  clientSlots.set(clientId, mySlots);

  broadcastSlotStatus(slotKey);
}

function releaseHold(clientId: string, slotKey: SlotKey) {
  const holds = slotHolds.get(slotKey);
  if (!holds) return;
  const filtered = holds.filter((h) => h.clientId !== clientId);
  if (filtered.length === 0) {
    slotHolds.delete(slotKey);
  } else {
    slotHolds.set(slotKey, filtered);
  }

  const mySlots = clientSlots.get(clientId);
  if (mySlots) mySlots.delete(slotKey);

  broadcastSlotStatus(slotKey);
}

function releaseAllHolds(clientId: string) {
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
/** Called by bookingController after a booking is confirmed — permanently releases and marks slot used */
export function markSlotBooked(slotKey: SlotKey) {
  // Broadcast that it's now "fully booked" by keeping a permanent marker
  const payload = JSON.stringify({
    type: 'slot_booked',
    slotKey,
    isBooked: true,
  });
  for (const [, ws] of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

/** Check how many active holds exist for a slot (used by booking controller) */
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

    // Send the client their own ID
    ws.send(JSON.stringify({ type: 'connected', clientId }));

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case 'hold_slot': {
            // Client is viewing/selecting this slot
            const key = makeSlotKey(msg.date, msg.timeSlot, msg.testIds);
            addHold(clientId, key);
            // Tell the client their current hold status
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
            // Client asks: is this slot currently held by anyone else?
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
        // ignore malformed messages
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
