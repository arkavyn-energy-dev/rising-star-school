/**
 * Twilio WhatsApp setup (Sandbox for testing).
 *
 * 1. Sign up: https://www.twilio.com/try-twilio
 * 2. Console → Messaging → Try it out → Send a WhatsApp message
 * 3. Copy Account SID, Auth Token, Sandbox number (+14155238886)
 * 4. From YOUR phone WhatsApp, send the "join xxx" code to the sandbox number
 * 5. Run:
 *    node scripts/setupTwilio.js ACCOUNT_SID AUTH_TOKEN +14155238886 7366056048
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { sendWhatsApp, resetWhatsAppClient, isWhatsAppConfigured } = require("../utils/sendWhatsApp");

const ENV_PATH = path.join(__dirname, "..", ".env");

const updateEnv = (updates) => {
  let content = fs.readFileSync(ENV_PATH, "utf8");
  for (const [key, value] of Object.entries(updates)) {
    const pattern = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}=${value}`;
    content = pattern.test(content) ? content.replace(pattern, line) : `${content.trim()}\n${line}\n`;
  }
  fs.writeFileSync(ENV_PATH, content.endsWith("\n") ? content : `${content}\n`);
};

async function main() {
  const sid = process.argv[2];
  const token = process.argv[3];
  const waFrom = process.argv[4];
  const testPhone = process.argv[5];

  if (!sid || !token || !waFrom) {
    console.log("\nTwilio WhatsApp setup — Rising Star School\n");
    console.log("Steps:");
    console.log("  1. https://www.twilio.com/try-twilio — free account banao");
    console.log("  2. Console → Messaging → Try WhatsApp → Sandbox");
    console.log("  3. Apne phone se sandbox number pe 'join <code>' WhatsApp karo");
    console.log("  4. Account SID + Auth Token copy karo");
    console.log("  5. Run:\n");
    console.log("     npm run whatsapp:setup ACCOUNT_SID AUTH_TOKEN +14155238886 YOUR_PHONE\n");
    console.log("Example:");
    console.log("     npm run whatsapp:setup ACxxxx xxxxxx +14155238886 7366056048\n");
    process.exit(1);
  }

  updateEnv({
    TWILIO_ACCOUNT_SID: sid,
    TWILIO_AUTH_TOKEN: token,
    TWILIO_WHATSAPP_FROM: waFrom.replace(/^whatsapp:/i, ""),
  });

  process.env.TWILIO_ACCOUNT_SID = sid;
  process.env.TWILIO_AUTH_TOKEN = token;
  process.env.TWILIO_WHATSAPP_FROM = waFrom.replace(/^whatsapp:/i, "");
  resetWhatsAppClient();

  if (!isWhatsAppConfigured()) {
    console.error("Twilio config failed to load.");
    process.exit(1);
  }

  console.log("\nUpdated Backend/.env with Twilio WhatsApp credentials.");

  if (testPhone) {
    const result = await sendWhatsApp({
      to: testPhone,
      message:
        "Rising Star Public School — WhatsApp notifications are now connected. You will receive test results and admission updates on this number.",
    });

    if (result.sent) {
      console.log(`Test WhatsApp sent to ${testPhone}`);
    } else {
      console.error("Test WhatsApp failed:", result.reason);
      console.error("\nMake sure you joined the Twilio sandbox from this phone first (send 'join <code>' to sandbox number).");
      process.exit(1);
    }
  }

  console.log("\nRestart backend: npm run dev\n");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
