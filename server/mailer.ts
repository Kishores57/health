import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
    if (!transporter) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken = await oAuth2Client.getAccessToken();

        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token as string,
            },
        });
        console.log("Gmail OAuth2 transporter created successfully.");
    }
    return transporter;
}

export async function sendBookingConfirmation(email: string, bookingDetails: any, testDetails: any = {}) {
    try {
        const t = await getTransporter();

        const fastingText = testDetails?.fastingRequired 
            ? `Please ensure you maintain a strict fasting period of <strong>${testDetails.fastingDuration} hours</strong> before your appointment.` 
            : `No fasting is required for your scheduled test.`;

        const htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e5ea; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 20px;">
                <h1 style="color: #0ea5e9; margin: 0; font-size: 24px;">Health Hub Laboratory</h1>
                <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Your Trusted Diagnostics Partner</p>
            </div>
            
            <h2 style="color: #0f172a; font-size: 20px;">Booking Confirmed!</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">Hello <strong>${bookingDetails.patientName}</strong>,</p>
            <p style="color: #334155; font-size: 16px; line-height: 1.5;">Your medical test has been successfully registered. Please find your appointment details below:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 8px 0; color: #1e293b; font-size: 15px;"><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                <p style="margin: 8px 0; color: #1e293b; font-size: 15px;"><strong>Test Name:</strong> ${testDetails?.name || 'Medical Test'}</p>
                <p style="margin: 8px 0; color: #1e293b; font-size: 15px;"><strong>Date:</strong> ${bookingDetails.bookingDate}</p>
                <p style="margin: 8px 0; color: #1e293b; font-size: 15px;"><strong>Time Slot:</strong> ${bookingDetails.timeSlot}</p>
            </div>
            
            <div style="background-color: #fffbfa; border: 1px solid #fed7aa; padding: 15px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #ea580c; margin-top: 0; font-size: 16px;">Important Preparation Instructions</h3>
                <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.5;">${fastingText}</p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e1e5ea; padding-top: 20px;">
                If you have any questions, please contact our support team.<br>
                Thank you for choosing Health Hub!
            </p>
        </div>
        `;

        const info = await t.sendMail({
            from: `"Health Hub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Health Hub - Booking Confirmation",
            html: htmlContent,
        });

        console.log("---- BOOKING EMAIL SENT ----");
        console.log("Message sent to: %s", info.accepted?.join(", "));
        console.log("----------------------------");
    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
    }
}

export async function sendReportNotification(email: string, reportUrl: string, filePath?: string, testName?: string) {
    try {
        const t = await getTransporter();

        const mailOptions: any = {
            from: `"Health Hub" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Medical Test Report is Ready",
            text: `A new report has been uploaded for your ${testName || 'booking'}. You can track and download it at: ${reportUrl}.`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e5ea; border-radius: 8px;">
                <div style="text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #0ea5e9; margin: 0; font-size: 24px;">Health Hub Laboratory</h1>
                </div>
                <h2 style="color: #0f172a; font-size: 20px;">Your Report is Ready!</h2>
                <p style="color: #334155; font-size: 16px;">Hello,</p>
                <p style="color: #334155; font-size: 16px;">The medical report for your recent <strong>${testName || 'test'}</strong> has successfully been processed. We have securely attached the PDF file directly to this email for your records.</p>
                <div style="margin-top: 30px; text-align: center;">
                    <a href="${reportUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Dashboard</a>
                </div>
                <p style="color: #64748b; font-size: 14px; margin-top: 30px; border-top: 1px solid #e1e5ea; padding-top: 20px; text-align: center;">
                    Thank you for trusting Health Hub!
                </p>
            </div>`,
            attachments: []
        };

        if (filePath) {
            mailOptions.attachments.push({
                filename: `${testName?.replace(/\s+/g, '_') || 'Medical_Test'}_Report.pdf`,
                path: filePath
            });
        }

        const info = await t.sendMail(mailOptions);

        console.log("---- REPORT EMAIL SENT ----");
        console.log("Message sent to: %s", info.accepted?.join(", "));
        console.log("---------------------------");
    } catch (error) {
        console.error("Failed to send report notification email:", error);
    }
}
