/**
 * One-time Gmail setup for Rising Star backend.
 *
 * 1. Google Account → Security → turn ON 2-Step Verification
 * 2. App passwords → create password for "Mail"
 * 3. Run: node scripts/setupGmail.js YOUR_16_CHAR_APP_PASSWORD
 *
 * Example:
 *   node scripts/setupGmail.js abcd efgh ijkl mnop
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { sendEmail, verifyEmailConnection, resetTransporter } = require("../utils/sendEmail");

const ENV_PATH = path.join(__dirname, "..", ".env");
const GMAIL_USER = process.env.GMAIL_SETUP_USER || "arkavyn.dev@gmail.com";

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
  const rawPass = process.argv[2];

  if (!rawPass) {
    console.log("\nGmail setup — Rising Star Public School Backend\n");
    console.log("Steps:");
    console.log("  1. Open https://myaccount.google.com/security");
    console.log("  2. Enable 2-Step Verification");
    console.log("  3. Search 'App passwords' → create one for Mail");
    console.log("  4. Run again with the 16-character password:\n");
    console.log("     node scripts/setupGmail.js YOUR_APP_PASSWORD\n");
    process.exit(1);
  }

  const appPassword = rawPass.replace(/\s+/g, "");

  updateEnv({
    EMAIL_HOST: "smtp.gmail.com",
    EMAIL_PORT: "587",
    EMAIL_USER: GMAIL_USER,
    EMAIL_PASS: appPassword,
    ADMIN_NOTIFY_EMAIL: GMAIL_USER,
    EMAIL_FROM_NAME: "Rising Star Public School",
  });

  // Reload env for this process
  process.env.EMAIL_USER = GMAIL_USER;
  process.env.EMAIL_PASS = appPassword;
  process.env.EMAIL_HOST = "smtp.gmail.com";
  process.env.EMAIL_PORT = "587";
  process.env.ADMIN_NOTIFY_EMAIL = GMAIL_USER;
  process.env.EMAIL_FROM_NAME = "Rising Star Public School";
  resetTransporter();

  console.log(`\nUpdated Backend/.env for ${GMAIL_USER}`);

  const verify = await verifyEmailConnection();
  if (!verify.ok) {
    console.error("\nGmail connection FAILED:", verify.reason);
    console.error("Double-check the App Password (not your normal Gmail password).\n");
    process.exit(1);
  }

  console.log("Gmail SMTP connection: OK");

  const testTo = process.env.ADMIN_NOTIFY_EMAIL || GMAIL_USER;
  const result = await sendEmail({
    to: testTo,
    subject: "Rising Star School — Email setup successful",
    html: `
      <h2>Email is working!</h2>
      <p>Gmail has been configured for <strong>Rising Star Public School</strong>.</p>
      <p>Admission enquiries, online test results, and admin messages will now be sent from this account.</p>
    `,
    text: "Email is working! Gmail configured for Rising Star Public School.",
  });

  if (result.sent) {
    console.log(`Test email sent to ${testTo}`);
    console.log("\nRestart the backend: npm run dev\n");
  } else {
    console.error("Test email failed:", result.reason);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
