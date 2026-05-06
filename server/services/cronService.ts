import cron from 'node-cron';
import http from 'http';
import https from 'https';
import { BookingModel } from '../models/Booking';
import { TestModel } from '../models/Test';

export const setupCronJobs = () => {

  // ── Reminder Cron: Every hour ─────────────────────────────────────────────
  // Uses { status, reminderSent, bookingDate } compound index for efficient scan
  cron.schedule('0 * * * *', async () => {
    const t0 = Date.now();
    console.log('[cron] Running reminder job...');

    try {
      const now = new Date();
      const tenHoursLater  = new Date(now.getTime() + 10 * 60 * 60 * 1000);
      const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);

      // Format to YYYY-MM-DD string range for comparison
      const dateFrom = tenHoursLater.toISOString().split('T')[0];
      const dateTo   = twelveHoursLater.toISOString().split('T')[0];

      // Fetch only bookings due in the 10–12 hour window using indexed fields
      const upcomingBookings = await BookingModel.find({
        status:        { $in: ['pending', 'confirmed'] },
        reminderSent:  false,
        bookingDate:   { $gte: dateFrom, $lte: dateTo },
      }).lean();

      if (upcomingBookings.length === 0) {
        console.log('[cron] No reminders needed.');
        return;
      }

      // ── Batch-fetch all test data needed (single query, not N queries) ────
      const allTestIds = Array.from(new Set(upcomingBookings.flatMap((b) => b.testIds)));
      const tests = await TestModel.find(
        { id: { $in: allTestIds } },
        'id name fastingRequired'
      ).lean();
      const testMap = new Map(tests.map((t) => [t.id, t]));

      // ── Process each booking ──────────────────────────────────────────────
      const idsToMark: number[] = [];
      for (const booking of upcomingBookings) {
        const firstTest = testMap.get(booking.testIds[0]);
        if (firstTest?.fastingRequired) {
          // TODO: Send email/SMS reminder here if needed
          idsToMark.push(booking.id);
        }
      }

      // ── Bulk-update reminderSent in ONE query ─────────────────────────────
      if (idsToMark.length > 0) {
        await BookingModel.updateMany(
          { id: { $in: idsToMark } },
          { $set: { reminderSent: true } }
        );
        console.log(`[cron] Marked ${idsToMark.length} reminder(s) sent.`);
      }

      console.log(`[cron] Reminder job done in ${Date.now() - t0}ms`);
    } catch (error: any) {
      console.error('[cron] Reminder job error:', error.message);
    }
  });

  // ── Keep-Alive Ping: Every 14 minutes ───────────────────────────────
  // Render Free Tier sleeps after 15 min of inactivity.
  // Pinging the EXTERNAL public URL keeps the server awake.
  const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes (just under the 15-min sleep threshold)

  const selfPing = () => {
    // Prefer the public Render URL so the ping comes from outside (prevents sleep).
    // Falls back to localhost if not on Render.
    const externalUrl = process.env.RENDER_EXTERNAL_URL;

    if (externalUrl) {
      // External HTTPS ping to the public Render URL
      const url = new URL('/api/health', externalUrl);
      const client = url.protocol === 'https:' ? https : http;
      const req = client.get(url.toString(), { timeout: 8000 }, (res) => {
        console.log(`[keep-alive] external ping → HTTP ${res.statusCode}`);
        res.resume(); // drain response body to free socket
      });
      req.on('error', (err) => {
        console.warn('[keep-alive] external ping failed:', err.message);
      });
      req.end();
    } else {
      // Fallback: localhost ping (development)
      const port = process.env.PORT || '5000';
      const req = http.request(
        { hostname: 'localhost', port, path: '/api/health', method: 'GET', timeout: 5000 },
        (res) => {
          console.log(`[keep-alive] local ping → HTTP ${res.statusCode}`);
          res.resume();
        }
      );
      req.on('error', () => { /* silently ignore on startup */ });
      req.end();
    }
  };

  // Start pinging 30s after boot (give server time to be ready)
  setTimeout(() => {
    selfPing();
    setInterval(selfPing, PING_INTERVAL_MS);
  }, 30_000);

  console.log('✅ Cron jobs scheduled. Keep-alive active (14 min interval, external URL).');
};
