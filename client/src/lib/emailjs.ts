import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_c6q37wa";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "hW9fsEiIRVDnVX6jG";

const TEMPLATE_BOOKING = import.meta.env.VITE_EMAILJS_TEMPLATE_BOOKING || "template_8uz5dtm";
const TEMPLATE_REPORT  = import.meta.env.VITE_EMAILJS_TEMPLATE_REPORT  || "template_ig48s9n";

// Initialize EmailJS once
emailjs.init(PUBLIC_KEY);

/**
 * Send booking confirmation email to the patient.
 */
export async function sendBookingConfirmation(params: {
  patient_name: string;
  email: string;
  booking_id: number | string;
  test_name: string;
  booking_date: string;
  time_slot: string;
  fasting_instructions: string;
}) {
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_BOOKING, {
      to_email: params.email,
      patient_name: params.patient_name,
      booking_id: `#${params.booking_id}`,
      test_name: params.test_name,
      booking_date: params.booking_date,
      time_slot: params.time_slot,
      fasting_instructions: params.fasting_instructions,
    });
    console.log("✅ Booking confirmation email sent to", params.email);
  } catch (error) {
    // Non-fatal — log but don't throw so booking flow continues
    console.error("❌ Failed to send booking confirmation email:", error);
  }
}

/**
 * Send report-ready notification email to the patient.
 */
export async function sendReportNotification(params: {
  email: string;
  test_name: string;
  report_url: string;
}) {
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_REPORT, {
      to_email: params.email,
      test_name: params.test_name,
      report_url: params.report_url,
    });
    console.log("✅ Report notification email sent to", params.email);
  } catch (error) {
    console.error("❌ Failed to send report notification email:", error);
  }
}
