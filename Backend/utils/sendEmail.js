const nodemailer = require("nodemailer");

let transporter = null;

const isEmailConfigured = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

const resetTransporter = () => {
  transporter = null;
};

const getFromAddress = () =>
  `"${process.env.EMAIL_FROM_NAME || process.env.SEED_ADMIN_NAME || "Rising Star Public School"}" <${process.env.EMAIL_USER}>`;

// Returns { sent: boolean, reason?: string } so admin actions can report real delivery status.
const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    console.warn("Email not sent (EMAIL_USER/EMAIL_PASS not configured):", subject);
    return { sent: false, reason: "EMAIL_USER and EMAIL_PASS are not set in Backend/.env" };
  }

  try {
    await getTransporter().sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
      text,
    });
    return { sent: true };
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return { sent: false, reason: error.message };
  }
};

const verifyEmailConnection = async () => {
  if (!isEmailConfigured()) {
    return { ok: false, reason: "EMAIL_USER and EMAIL_PASS are not set in Backend/.env" };
  }

  try {
    await getTransporter().verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
};

module.exports = sendEmail;
module.exports.sendEmail = sendEmail;
module.exports.verifyEmailConnection = verifyEmailConnection;
module.exports.isEmailConfigured = isEmailConfigured;
module.exports.resetTransporter = resetTransporter;
module.exports.getFromAddress = getFromAddress;
