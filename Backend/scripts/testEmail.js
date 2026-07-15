require("dotenv").config();
const { verifyEmailConnection, sendEmail, isEmailConfigured } = require("../utils/sendEmail");

async function main() {
  if (!isEmailConfigured()) {
    console.error("Email not configured. Run: npm run email:setup YOUR_APP_PASSWORD");
    process.exit(1);
  }

  const verify = await verifyEmailConnection();
  if (!verify.ok) {
    console.error("SMTP verify failed:", verify.reason);
    process.exit(1);
  }

  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER;
  const result = await sendEmail({
    to,
    subject: "Rising Star — test email",
    html: "<p>If you received this, email notifications are working.</p>",
  });

  if (result.sent) {
    console.log(`Test email sent to ${to}`);
  } else {
    console.error("Send failed:", result.reason);
    process.exit(1);
  }
}

main();
