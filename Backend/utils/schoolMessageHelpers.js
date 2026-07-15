const buildSchoolDetailsText = (settings) => {
  const lines = [];
  if (settings?.address) lines.push(`Address: ${settings.address}`);
  if (settings?.phone) lines.push(`Phone: ${settings.phone}`);
  if (settings?.email) lines.push(`Email: ${settings.email}`);
  if (settings?.timings) lines.push(`School Timings: ${settings.timings}`);
  return lines.join("\n");
};

const buildSchoolDetailsHtml = (settings) => {
  const items = [];
  if (settings?.address) items.push(`<li><strong>Address:</strong> ${settings.address}</li>`);
  if (settings?.phone) items.push(`<li><strong>Phone:</strong> ${settings.phone}</li>`);
  if (settings?.email) items.push(`<li><strong>Email:</strong> ${settings.email}</li>`);
  if (settings?.timings) items.push(`<li><strong>Timings:</strong> ${settings.timings}</li>`);
  if (items.length === 0) return "";
  return `<ul style="margin:12px 0;padding-left:20px;line-height:1.7">${items.join("")}</ul>`;
};

const scorePercent = (score, total) => (total ? Math.round((score / total) * 100) : 0);

const buildTestSubmissionMessages = ({ settings, studentName, testTitle, referenceId, score, totalQuestions }) => {
  const schoolName = settings?.schoolName || "Rising Star Public School";
  const pct = scorePercent(score, totalQuestions);
  const details = buildSchoolDetailsText(settings);

  const text = [
    `Dear ${studentName},`,
    "",
    `Thank you for taking the online assessment at ${schoolName}.`,
    "",
    `Test: ${testTitle}`,
    `Reference ID: ${referenceId}`,
    `Your Score: ${score}/${totalQuestions} (${pct}%)`,
    "",
    "Your test has been submitted successfully. Our academic team is reviewing your performance.",
    "Please wait for the results — you will receive an update on your registered email and WhatsApp number once the review is complete.",
    "",
    details,
    "",
    `— Admissions Team, ${schoolName}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:560px">
      <h2 style="color:#9b2335">Thank You, ${studentName}!</h2>
      <p>Thank you for taking the time to appear in the online assessment at <strong>${schoolName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#f9f9f9;border-radius:8px">
        <tr><td style="padding:10px 14px;border-bottom:1px solid #eee"><strong>Test</strong></td><td style="padding:10px 14px;border-bottom:1px solid #eee">${testTitle}</td></tr>
        <tr><td style="padding:10px 14px;border-bottom:1px solid #eee"><strong>Reference ID</strong></td><td style="padding:10px 14px;border-bottom:1px solid #eee">${referenceId}</td></tr>
        <tr><td style="padding:10px 14px"><strong>Score</strong></td><td style="padding:10px 14px">${score} / ${totalQuestions} (${pct}%)</td></tr>
      </table>
      <p>Your submission has been received. Our team will review your answers and contact you with the result on your registered email and phone number.</p>
      <p><strong>No further action is needed from your side at this time.</strong> Please wait for our response.</p>
      <h3 style="color:#9b2335;font-size:15px;margin-top:20px">School Contact</h3>
      ${buildSchoolDetailsHtml(settings)}
      <p style="margin-top:24px;color:#666">— Admissions Team,<br/><strong>${schoolName}</strong></p>
    </div>
  `;

  return {
    subject: `Test submitted — ${schoolName} (Ref: ${referenceId})`,
    text,
    html,
  };
};

const buildTestSelectionMessages = ({ settings, attempt }) => {
  const schoolName = settings?.schoolName || "Rising Star Public School";
  const principalName = settings?.aboutContent?.principalName || "Principal";
  const directorName = settings?.aboutContent?.directorName || "Director";
  const pct = scorePercent(attempt.score, attempt.totalQuestions);
  const details = buildSchoolDetailsText(settings);

  const text = [
    `CONGRATULATIONS ${attempt.studentName}!`,
    "",
    `We are pleased to inform you that you have been SELECTED for admission at ${schoolName} based on your online assessment.`,
    "",
    `Assessment: ${attempt.testTitle}`,
    `Class: ${attempt.studentClass}`,
    `Your Score: ${attempt.score}/${attempt.totalQuestions} (${pct}%)`,
    `Reference ID: ${attempt.referenceId}`,
    "",
    "NEXT STEPS:",
    "1. Our admissions team will call you at your registered number within 24–48 hours.",
    "2. Please visit the school with your parent/guardian to complete admission formalities.",
    "3. Carry Aadhaar, previous school records, and passport-size photographs.",
    "",
    "SCHOOL DETAILS:",
    details,
    "",
    `Principal: ${principalName}`,
    `Director: ${directorName}`,
    "",
    `We look forward to welcoming you to the Rising Star family!`,
    "",
    `— Admissions Team, ${schoolName}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:560px">
      <div style="background:linear-gradient(135deg,#9b2335,#7b1c2a);color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;font-size:22px">Congratulations, ${attempt.studentName}!</h2>
        <p style="margin:8px 0 0;opacity:0.9">You have been selected for admission</p>
      </div>
      <div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 12px 12px">
        <p>We are delighted to inform you that you have been <strong>SELECTED</strong> for admission at <strong>${schoolName}</strong> based on your performance in the online assessment.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#f9f9f9;border-radius:8px">
          <tr><td style="padding:10px 14px;border-bottom:1px solid #eee"><strong>Assessment</strong></td><td style="padding:10px 14px;border-bottom:1px solid #eee">${attempt.testTitle}</td></tr>
          <tr><td style="padding:10px 14px;border-bottom:1px solid #eee"><strong>Class</strong></td><td style="padding:10px 14px;border-bottom:1px solid #eee">${attempt.studentClass}</td></tr>
          <tr><td style="padding:10px 14px;border-bottom:1px solid #eee"><strong>Score</strong></td><td style="padding:10px 14px;border-bottom:1px solid #eee">${attempt.score} / ${attempt.totalQuestions} (${pct}%)</td></tr>
          <tr><td style="padding:10px 14px"><strong>Reference ID</strong></td><td style="padding:10px 14px">${attempt.referenceId}</td></tr>
        </table>
        <h3 style="color:#9b2335;font-size:15px">Next Steps</h3>
        <ol style="line-height:1.8;padding-left:20px">
          <li>Our admissions team will call you at <strong>${attempt.phone}</strong> within 24–48 hours.</li>
          <li>Please visit the school with your parent/guardian to complete admission formalities.</li>
          <li>Carry Aadhaar, previous school records, and passport-size photographs.</li>
        </ol>
        <h3 style="color:#9b2335;font-size:15px;margin-top:20px">School Details</h3>
        ${buildSchoolDetailsHtml(settings)}
        <p style="margin-top:16px"><strong>Principal:</strong> ${principalName}<br/><strong>Director:</strong> ${directorName}</p>
        <p style="margin-top:20px">We look forward to welcoming you to the Rising Star family!</p>
        <p style="margin-top:24px;color:#666">— Admissions Team,<br/><strong>${schoolName}</strong></p>
      </div>
    </div>
  `;

  return {
    subject: `Congratulations! You're Selected — ${schoolName}`,
    text,
    html,
  };
};

const buildTestRejectionMessages = ({ settings, attempt }) => {
  const schoolName = settings?.schoolName || "Rising Star Public School";
  const details = buildSchoolDetailsText(settings);

  const text = [
    `Dear ${attempt.studentName},`,
    "",
    `Thank you for appearing in the online assessment for ${schoolName} (${attempt.testTitle}).`,
    "",
    `After careful review, we are unable to move forward with your application at this time.`,
    "We encourage you to apply again in the future or visit our campus for a personal consultation.",
    "",
    details,
    "",
    `— Admissions Team, ${schoolName}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:560px">
      <h2 style="color:#9b2335">Dear ${attempt.studentName},</h2>
      <p>Thank you for taking the time to attempt our online assessment for <strong>${attempt.testTitle}</strong> at ${schoolName}.</p>
      <p>After careful review, we are unable to move forward with your application at this time. We encourage you to apply again in the future.</p>
      <h3 style="color:#9b2335;font-size:15px;margin-top:20px">School Contact</h3>
      ${buildSchoolDetailsHtml(settings)}
      <p style="margin-top:24px;color:#666">— Admissions Team,<br/><strong>${schoolName}</strong></p>
    </div>
  `;

  return {
    subject: `Update on your assessment — ${schoolName}`,
    text,
    html,
  };
};

module.exports = {
  buildTestSubmissionMessages,
  buildTestSelectionMessages,
  buildTestRejectionMessages,
};
