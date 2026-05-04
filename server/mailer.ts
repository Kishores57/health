/**
 * Backend Email Service (via EmailJS HTTP API)
 * Bypasses Render's Free Tier SMTP port blocks by using HTTP.
 */

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

// Uses process.env first (for Render), fallback to defaults from original client config
const getEmailJsConfig = () => ({
  service_id: process.env.EMAILJS_SERVICE_ID || "service_c6q37wa",
  public_key: process.env.EMAILJS_PUBLIC_KEY || "hW9fsEiIRVDnVX6jG",
  template_booking: process.env.EMAILJS_TEMPLATE_BOOKING || "template_8uz5dtm",
  template_report: process.env.EMAILJS_TEMPLATE_REPORT || "template_ig48s9n",
});

// ── Booking Confirmation ──────────────────────────────────────────────────────
export async function sendBookingConfirmation(
  email: string,
  bookingDetails: any,
  testDetails: any = {}
): Promise<void> {
  try {
    const config = getEmailJsConfig();
    const fastingText = testDetails?.fastingRequired
      ? `Please ensure you maintain a strict fasting period of ${testDetails.fastingDuration} hours before your appointment.`
      : `No fasting is required for your scheduled test.`;

    const payload = {
      service_id: config.service_id,
      template_id: config.template_booking,
      user_id: config.public_key,
      template_params: {
        to_email: email,
        email: email,
        patient_name: bookingDetails.patientName,
        booking_id: `#${bookingDetails.bookingId || bookingDetails.id}`,
        test_name: testDetails?.name || "Medical Test",
        booking_date: bookingDetails.bookingDate,
        time_slot: bookingDetails.timeSlot,
        fasting_instructions: fastingText,
      },
    };

    const response = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": process.env.VITE_API_URL || "https://health-8zu0.onrender.com"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API Error: ${response.status} ${errorText}`);
    }

    console.log(`✅ Booking confirmation sent to ${email} (via EmailJS REST API)`);
  } catch (error: any) {
    console.error("❌ sendBookingConfirmation failed:", error.message);
    throw error; // re-throw so caller can handle (fire-and-forget in controller)
  }
}

// ── Report Ready Notification ─────────────────────────────────────────────────
export async function sendReportNotification(
  email: string,
  reportUrl: string,
  filePath?: string,
  testName?: string
): Promise<void> {
  try {
    const config = getEmailJsConfig();

    const payload = {
      service_id: config.service_id,
      template_id: config.template_report,
      user_id: config.public_key,
      template_params: {
        to_email: email,
        email: email,
        test_name: testName || "Medical Test",
        report_url: reportUrl,
        // Note: EmailJS free tier doesn't support direct attachments, so we provide the dashboard URL
      },
    };

    const response = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": process.env.VITE_API_URL || "https://health-8zu0.onrender.com"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API Error: ${response.status} ${errorText}`);
    }

    console.log(`✅ Report notification sent to ${email} (via EmailJS REST API)`);
  } catch (error: any) {
    console.error("❌ sendReportNotification failed:", error.message);
    throw error;
  }
}
