import twilio from 'twilio';

// Use environment variables for production
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy_account_sid';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'dummy_auth_token';
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Default Twilio sandbox number

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Sends a WhatsApp message using Twilio API.
 * 
 * @param to - The target phone number
 * @param body - The text message body
 */
export async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  try {
    // Format phone number to E.164 if they just provided 10 digits
    // Assumes India country code (+91) if 10 digits are provided
    let formattedPhone = to.replace(/\D/g, "");
    if (formattedPhone.length === 10) {
        formattedPhone = "91" + formattedPhone;
    }
    if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone;
    }

    const targetNumber = `whatsapp:${formattedPhone}`;

    const message = await client.messages.create({
      body,
      from: TWILIO_WHATSAPP_NUMBER,
      to: targetNumber
    });

    console.log(`WhatsApp message sent! SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    // Return false instead of throwing to avoid crashing the app if Twilio fails
    return false;
  }
}
