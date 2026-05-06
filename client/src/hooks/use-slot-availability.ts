import { useEffect, useRef, useState, useCallback } from "react";
import { getApiUrl } from "@/lib/api-url";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getWsUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
  // Convert http(s) → ws(s)
  return apiUrl.replace(/^http/, "ws") + "/ws/slots";
}

export interface SlotStatus {
  isHeld: boolean;    // someone else is viewing/selecting this slot
  isBooked: boolean;  // slot has an accepted booking
  holdCount: number;  // number of users currently viewing it
}

// ── Hook ──────────────────────────────────────────────────────────────────────
/**
 * useSlotAvailability — connects to the server WebSocket and tracks whether
 * the currently-selected (date, timeSlot, testIds) combination is held or
 * booked by another user.
 *
 * Usage:
 *   const { status, holdSlot, releaseSlot } = useSlotAvailability();
 *
 *   // When user picks a slot:
 *   holdSlot("2026-05-07", "09:00 AM", [1, 3]);
 *
 *   // On unmount / slot change:
 *   releaseSlot();
 */
export function useSlotAvailability() {
  const ws = useRef<WebSocket | null>(null);
  const currentSlot = useRef<{ date: string; timeSlot: string; testIds: number[] } | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<SlotStatus>({ isHeld: false, isBooked: false, holdCount: 0 });
  const [connected, setConnected] = useState(false);

  // Track bookedSlots across broadcasts
  const bookedSlots = useRef<Set<string>>(new Set());

  const makeKey = (date: string, timeSlot: string, testIds: number[]) =>
    `${date}|${timeSlot}|${[...testIds].sort().join(",")}`;

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(getWsUrl());
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      // Re-hold current slot if connection was restored
      if (currentSlot.current) {
        socket.send(JSON.stringify({ type: "hold_slot", ...currentSlot.current }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const cur = currentSlot.current;

        if (msg.type === "slot_status" && cur) {
          const curKey = makeKey(cur.date, cur.timeSlot, cur.testIds);
          if (msg.slotKey === curKey) {
            const isBooked = bookedSlots.current.has(curKey);
            setStatus({
              isHeld: msg.holdCount > 1,  // >1 because WE are one of the holders
              isBooked,
              holdCount: msg.holdCount,
            });
          }
        }

        if (msg.type === "slot_booked") {
          bookedSlots.current.add(msg.slotKey);
          if (cur && msg.slotKey === makeKey(cur.date, cur.timeSlot, cur.testIds)) {
            setStatus({ isHeld: false, isBooked: true, holdCount: 0 });
          }
        }

        if (msg.type === "hold_ack" && cur) {
          const curKey = makeKey(cur.date, cur.timeSlot, cur.testIds);
          if (msg.slotKey === curKey) {
            const isBooked = bookedSlots.current.has(curKey);
            setStatus({
              isHeld: msg.holdCount > 1,
              isBooked,
              holdCount: msg.holdCount,
            });
          }
        }
      } catch {
        // ignore malformed messages
      }
    };

    socket.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3s
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    socket.onerror = () => {
      socket.close();
    };
  }, []);

  // Open WebSocket on mount
  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  /**
   * Call when the user selects a new (date + timeSlot + testIds) combination.
   * Releases any previous hold and registers this one.
   */
  const holdSlot = useCallback((date: string, timeSlot: string, testIds: number[]) => {
    if (!date || !timeSlot || testIds.length === 0) return;

    // Release previous slot
    if (currentSlot.current) {
      ws.current?.send(JSON.stringify({ type: "release_slot", ...currentSlot.current }));
    }

    currentSlot.current = { date, timeSlot, testIds };
    // Reset status optimistically while we wait for server response
    setStatus({ isHeld: false, isBooked: false, holdCount: 0 });

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "hold_slot", date, timeSlot, testIds }));
    }
  }, []);

  /**
   * Call when the user clears their slot selection or navigates away.
   */
  const releaseSlot = useCallback(() => {
    if (currentSlot.current && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "release_slot", ...currentSlot.current }));
    }
    currentSlot.current = null;
    setStatus({ isHeld: false, isBooked: false, holdCount: 0 });
  }, []);

  return { status, connected, holdSlot, releaseSlot };
}
