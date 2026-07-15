let twilioClient = null;

const isConfigured = () =>
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SMS_FROM;

const getClient = () => {
  if (twilioClient) return twilioClient;
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
};

const toE164 = (phone) => {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? digits : `+91${digits.replace(/^0+/, "")}`;
};

// Best-effort SMS send — skips silently (with a console warning) until
// TWILIO_* env vars are configured, so form submissions never fail because
// of a missing SMS provider.
const sendSMS = async ({ to, message }) => {
  if (!isConfigured()) {
    console.warn("SMS not sent (Twilio env vars not configured):", message?.slice(0, 60));
    return;
  }

  try {
    await getClient().messages.create({
      from: process.env.TWILIO_SMS_FROM,
      to: toE164(to),
      body: message,
    });
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
  }
};

module.exports = sendSMS;
