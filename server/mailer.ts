import nodemailer, { type SendMailOptions } from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER and EMAIL_PASS environment variables must be set.");
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✉️  Gmail SMTP transporter initialized.");
  }
  return transporter;
}

// ── Booking Confirmation ──────────────────────────────────────────────────────
export async function sendBookingConfirmation(
  email: string,
  bookingDetails: any,
  testDetails: any = {}
): Promise<void> {
  try {
    const t = getTransporter();

    const fastingText = testDetails?.fastingRequired
      ? `Please ensure you maintain a strict fasting period of <strong>${testDetails.fastingDuration} hours</strong> before your appointment.`
      : `No fasting is required for your scheduled test.`;

    const htmlContent = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e1e5ea;border-radius:8px;background:#fff;">
      <div style="text-align:center;border-bottom:2px solid #0ea5e9;padding-bottom:15px;margin-bottom:20px;">
        <h1 style="color:#0ea5e9;margin:0;font-size:24px;">Health Hub Laboratory</h1>
        <p style="color:#64748b;margin:5px 0 0;font-size:14px;">Your Trusted Diagnostics Partner</p>
      </div>

      <h2 style="color:#0f172a;font-size:20px;">Booking Confirmed! 🎉</h2>
      <p style="color:#334155;font-size:16px;line-height:1.5;">Hello <strong>${bookingDetails.patientName}</strong>,</p>
      <p style="color:#334155;font-size:16px;line-height:1.5;">Your medical test has been successfully registered. Please find your appointment details below:</p>

      <div style="background:#f8fafc;border-left:4px solid #0ea5e9;padding:15px;margin:20px 0;border-radius:4px;">
        <p style="margin:8px 0;color:#1e293b;font-size:15px;"><strong>Booking ID:</strong> ${bookingDetails.bookingId || bookingDetails.id}</p>
        <p style="margin:8px 0;color:#1e293b;font-size:15px;"><strong>Test Name:</strong> ${testDetails?.name || "Medical Test"}</p>
        <p style="margin:8px 0;color:#1e293b;font-size:15px;"><strong>Date:</strong> ${bookingDetails.bookingDate}</p>
        <p style="margin:8px 0;color:#1e293b;font-size:15px;"><strong>Time Slot:</strong> ${bookingDetails.timeSlot}</p>
        <p style="margin:8px 0;color:#1e293b;font-size:15px;"><strong>Patient:</strong> ${bookingDetails.patientName}</p>
      </div>

      <div style="background:#fffbfa;border:1px solid #fed7aa;padding:15px;margin:20px 0;border-radius:8px;">
        <h3 style="color:#ea580c;margin-top:0;font-size:16px;">⚠️ Preparation Instructions</h3>
        <p style="color:#475569;margin:0;font-size:14px;line-height:1.5;">${fastingText}</p>
      </div>

      <p style="color:#64748b;font-size:14px;margin-top:30px;text-align:center;border-top:1px solid #e1e5ea;padding-top:20px;">
        If you have any questions, please contact our support team.<br>
        Thank you for choosing Health Hub!
      </p>
    </div>`;

    const info = await t.sendMail({
      from: `"Health Hub Laboratory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Health Hub – Booking Confirmation",
      html: htmlContent,
    });

    console.log("✅ Booking confirmation sent →", info.accepted?.join(", "));
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
    const t = getTransporter();

    const mailOptions: SendMailOptions = {
      from: `"Health Hub Laboratory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Medical Report is Ready – Health Hub",
      html: `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e1e5ea;border-radius:8px;background:#fff;">
        <div style="text-align:center;border-bottom:2px solid #0ea5e9;padding-bottom:15px;margin-bottom:20px;">
          <h1 style="color:#0ea5e9;margin:0;font-size:24px;">Health Hub Laboratory</h1>
        </div>
        <h2 style="color:#0f172a;font-size:20px;">Your Report is Ready! 📋</h2>
        <p style="color:#334155;font-size:16px;">Hello,</p>
        <p style="color:#334155;font-size:16px;">
          The medical report for your recent <strong>${testName || "test"}</strong> has been processed and is ready.
          ${filePath ? "The PDF is attached to this email for your records." : ""}
        </p>
        <div style="margin:30px 0;text-align:center;">
          <a href="${reportUrl}"
             style="background:#0ea5e9;color:#fff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
            View on Dashboard
          </a>
        </div>
        <p style="color:#64748b;font-size:14px;text-align:center;border-top:1px solid #e1e5ea;padding-top:20px;margin-top:30px;">
          Thank you for trusting Health Hub!
        </p>
      </div>`,
      attachments: [],
    };

    if (filePath) {
      (mailOptions.attachments as any[]).push({
        filename: `${(testName || "Medical_Test").replace(/\s+/g, "_")}_Report.pdf`,
        path: filePath,
      });
    }

    const info = await t.sendMail(mailOptions);
    console.log("✅ Report notification sent →", info.accepted?.join(", "));
  } catch (error: any) {
    console.error("❌ sendReportNotification failed:", error.message);
    throw error;
  }
}
