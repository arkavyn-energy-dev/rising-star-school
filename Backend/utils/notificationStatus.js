const { isEmailConfigured } = require("./sendEmail");
const { isWhatsAppConfigured } = require("./sendWhatsApp");

const getNotificationConfig = () => ({
  emailConfigured: isEmailConfigured(),
  whatsappConfigured: isWhatsAppConfigured(),
});

const buildDeliveryReport = ({ emailResult, whatsappResult }) => {
  const config = getNotificationConfig();
  const lines = [];

  if (emailResult !== undefined) {
    lines.push(
      emailResult.sent
        ? "Email: sent successfully"
        : `Email: failed — ${emailResult.reason || "check Gmail setup"}`
    );
  }
  if (whatsappResult !== undefined) {
    lines.push(
      whatsappResult.sent
        ? "WhatsApp: sent successfully"
        : `WhatsApp: failed — ${whatsappResult.reason || "check Twilio setup"}`
    );
  }

  const emailOk = emailResult === undefined || emailResult.sent;
  const waOk = whatsappResult === undefined || whatsappResult.sent;

  return {
    ...config,
    messages: lines,
    allConfigured: emailOk && waOk,
  };
};

module.exports = { getNotificationConfig, buildDeliveryReport };
