let twilioClient = null;

const isWhatsAppConfigured = () =>
  Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM);

const getClient = () => {
  if (twilioClient) return twilioClient;
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
};

const resetWhatsAppClient = () => {
  twilioClient = null;
};

const toWhatsAppAddress = (phone) => {
  const digits = phone.replace(/[^\d+]/g, "");
  const withCountryCode = digits.startsWith("+") ? digits : `+91${digits.replace(/^0+/, "")}`;
  return `whatsapp:${withCountryCode}`;
};

const getWhatsAppFrom = () => {
  let num = (process.env.TWILIO_WHATSAPP_FROM || "").replace(/^whatsapp:/i, "").trim();
  if (!num.startsWith("+")) num = `+${num}`;
  return `whatsapp:${num}`;
};

const sendWhatsApp = async ({ to, message }) => {
  if (!isWhatsAppConfigured()) {
    console.warn("WhatsApp message not sent (Twilio env vars not configured):", message?.slice(0, 60));
    return {
      sent: false,
      reason: "Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in Backend/.env",
    };
  }

  try {
    await getClient().messages.create({
      from: getWhatsAppFrom(),
      to: toWhatsAppAddress(to),
      body: message,
    });
    return { sent: true };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
    return { sent: false, reason: error.message };
  }
};

module.exports = sendWhatsApp;
module.exports.sendWhatsApp = sendWhatsApp;
module.exports.isWhatsAppConfigured = isWhatsAppConfigured;
module.exports.resetWhatsAppClient = resetWhatsAppClient;
module.exports.toWhatsAppAddress = toWhatsAppAddress;
