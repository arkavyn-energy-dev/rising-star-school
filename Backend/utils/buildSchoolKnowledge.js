const SiteSettings = require("../models/SiteSettings");
const Faculty = require("../models/Faculty");
const Announcement = require("../models/Announcement");
const Event = require("../models/Event");

/**
 * Build a plain-text knowledge base from live MongoDB data.
 * The chatbot may ONLY answer from this text — never invent facts.
 */
async function buildSchoolKnowledge() {
  const [settings, faculty, announcements, events] = await Promise.all([
    SiteSettings.getSingleton(),
    Faculty.find({ isActive: { $ne: false } })
      .sort({ order: 1 })
      .select("name designation subject qualification")
      .lean()
      .catch(() => []),
    Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .select("text")
      .lean()
      .catch(() => []),
    Event.find()
      .sort({ date: -1 })
      .limit(8)
      .select("title date description")
      .lean()
      .catch(() => []),
  ]);

  const s = settings?.toObject ? settings.toObject() : settings || {};
  const about = s.aboutContent || {};
  const academics = s.academics || {};

  const lines = [
    "=== RISING STAR PUBLIC SCHOOL — OFFICIAL DATA ===",
    `School Name: ${s.schoolName || "Rising Star Public School"}`,
    `Tagline: ${s.tagline || ""}`,
    `Description: ${s.description || ""}`,
    `Established Year: ${s.establishedYear || ""}`,
    `Address: ${s.address || ""}`,
    `Phone: ${s.phone || ""}`,
    `Email: ${s.email || ""}`,
    `School Timings: ${s.timings || ""}`,
    "",
    "--- About ---",
    `History: ${about.history || ""}`,
    `Mission: ${about.mission || ""}`,
    `Vision: ${about.vision || ""}`,
    `Principal: ${about.principalName || ""}`,
    `Principal Message: ${about.principalMessage || ""}`,
    `Director: ${about.directorName || ""}`,
    `Director Message: ${about.directorMessage || ""}`,
    "",
    "--- Core Values ---",
    ...(about.values || []).map((v) => `- ${v.title}: ${v.description}`),
    "",
    "--- Programs ---",
    ...(s.programs || []).map(
      (p) => `- ${p.title} (${p.grades || ""}): ${p.description || ""}`
    ),
    "",
    "--- Why Choose Us ---",
    ...(s.whyChooseUs || []).map((w) => `- ${w.title}: ${w.description}`),
    "",
    "--- Facilities ---",
    ...(s.facilities || []).map((f) => `- ${f.title}: ${f.description}`),
    "",
    "--- Academics / Curriculum ---",
    "Teaching Methodologies:",
    ...(academics.methodology || []).map((m) => `- ${m.title}: ${m.description}`),
    "Subjects / Streams:",
    ...(academics.streams || []).map((st) => `- ${st.name}: ${st.subjects}`),
    "",
    "--- Fee Structure ---",
    ...(s.feeStructure || []).map(
      (f) =>
        `- ${f.grade}: Admission ${f.admission}, Tuition ${f.tuition}, Annual ${f.annual}`
    ),
    "",
    "--- Admission Process ---",
    ...(s.admissionProcess || []).map(
      (a) => `Step ${a.step}: ${a.title} — ${a.description}`
    ),
    "",
    "--- Documents Required ---",
    ...(s.documentsRequired || []).map((d) => `- ${d}`),
    "",
    "--- Stats ---",
    ...(s.stats || []).map((st) => `- ${st.label}: ${st.value}${st.suffix || ""}`),
    "",
    "--- Faculty ---",
    ...(faculty || []).map(
      (f) =>
        `- ${f.name}${f.designation ? ` (${f.designation})` : ""}${f.subject ? `, Subject: ${f.subject}` : ""}${f.qualification ? `, Qualification: ${f.qualification}` : ""}`
    ),
    "",
    "--- Announcements ---",
    ...(announcements || []).map((a) => `- ${a.text || ""}`),
    "",
    "--- Events ---",
    ...(events || []).map((e) => {
      const dateStr = e.date ? new Date(e.date).toLocaleDateString("en-IN") : "";
      return `- ${e.title}${dateStr ? ` (${dateStr})` : ""}: ${e.description || ""}`;
    }),
    "",
    "--- Website Pages ---",
    "Home, About, Academics, Admissions, Faculty, Gallery, Events, Contact, Online Test",
    "Parents can apply/enquire via the Admissions page or Apply Now button on the website.",
    "=== END OF OFFICIAL DATA ===",
  ];

  return lines.filter((l) => l !== undefined).join("\n");
}

module.exports = { buildSchoolKnowledge };
