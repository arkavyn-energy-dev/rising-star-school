// Updates the dev database with real Rising Star Public School (Bettiah) content.
// Run: node seed/patchRealSchoolData.js

const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const SiteSettings = require("../models/SiteSettings");
const Event = require("../models/Event");
const GalleryImage = require("../models/GalleryImage");
const Announcement = require("../models/Announcement");
const Test = require("../models/Test");
const Faculty = require("../models/Faculty");
const Testimonial = require("../models/Testimonial");
const { buildQuestions } = require("./questionBank");

const IMG = "/school-images";

const siteSettings = {
  schoolName: "Rising Star Public School",
  tagline: "Nurturing Brilliance, Building Futures",
  description:
    "Rising Star Public School is an English-medium institution in Bettiah, West Champaran, Bihar, offering quality education from Nursery to Class 10th. Founded in 2022, we are a growing, trusted school focused on strong academics, values, and holistic development.",
  phone: "+91 7366056048",
  email: "arkavyn.dev@gmail.com",
  address: "New Colony, Bettiah, West Champaran, Bihar — 845438",
  timings: "Mon - Sat: 7:00 AM - 12:00 PM",
  establishedYear: 2022,
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14388.5!2d84.5037!3d26.8014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDQ4JzA1LjAiTiA4NMKwMzAnMTMuMyJF!5e0!3m2!1sen!2sin!4v1710000000000",
  socialLinks: { facebook: "", twitter: "", instagram: "", youtube: "" },
  stats: [
    { label: "Students", value: 200, suffix: "+" },
    { label: "Teachers", value: 20, suffix: "+" },
    { label: "Years Growing", value: 4, suffix: "+" },
    { label: "English Medium", value: 100, suffix: "%" },
  ],
  programs: [
    {
      title: "Pre-Primary",
      grades: "Nursery - UKG",
      description: "Play-based English-medium learning in a safe, child-friendly environment that builds confidence and early literacy.",
      imageUrl: `${IMG}/img-1-pre-primary.jpg`,
    },
    {
      title: "Primary School",
      grades: "Class 1 - 5",
      description: "Strong foundation in English, Mathematics, Science, and Hindi with activity-based learning and regular sports.",
      imageUrl: `${IMG}/29d566bc-a5d5-47fe-a9a0-5d4d044545e9.jpg`,
    },
    {
      title: "Middle School",
      grades: "Class 6 - 8",
      description: "Concept-focused teaching with project work, assessments, and co-curricular activities for growing learners.",
      imageUrl: `${IMG}/img-3-middle.jpg`,
    },
    {
      title: "Secondary School",
      grades: "Class 9 - 10",
      description: "Board-focused preparation with emphasis on clarity, practice, and confidence for Class 10 examinations.",
      imageUrl: `${IMG}/4a8f3696-3218-45d2-95e1-9b929d13fc15.jpg`,
    },
    {
      title: "Sports & Activities",
      grades: "All Classes",
      description: "Cricket, badminton, carrom, running, kabaddi, and cultural programs — standard-wise participation for Nursery to Class 5.",
      imageUrl: `${IMG}/img-4-sports.jpg`,
    },
    {
      title: "Computer Education",
      grades: "Class 5 - 10",
      description: "Hands-on computer lab sessions for students from Class 5th onwards — building digital skills for the future.",
      imageUrl: `${IMG}/img-5-computer.jpg`,
    },
  ],
  whyChooseUs: [
    { title: "Qualified Teachers", description: "Experienced and dedicated educators committed to every child's growth.", icon: "👨‍🏫" },
    { title: "Strong Academics", description: "English-medium curriculum with focus on fundamentals, discipline, and regular assessments.", icon: "📚" },
    { title: "Safe Environment", description: "A child-friendly campus where students feel secure, supported, and motivated to learn.", icon: "🛡️" },
    { title: "Co-curricular Activities", description: "Sports, arts, and cultural programs for balanced development beyond the classroom.", icon: "🎨" },
    { title: "Value-based Education", description: "We nurture honesty, respect, responsibility, and good character alongside academics.", icon: "🤝" },
    { title: "Parent Interaction", description: "Regular parent-teacher meetings to keep families involved in their child's progress.", icon: "👪" },
  ],
  facilities: [
    {
      title: "Bus & Van Service",
      description: "Safe school transport facility covering major routes in and around Bettiah. (Expanding as enrollment grows.)",
      icon: "🚌",
      imageUrl: `${IMG}/img-6-bus.jpg`,
    },
    {
      title: "Computer Lab (Class 5–10)",
      description: "Dedicated computer education for students from Class 5th to 10th with practical, hands-on sessions.",
      icon: "💻",
      imageUrl: `${IMG}/img-7-computer-lab.webp`,
    },
    {
      title: "Sports & Playground",
      description: "Regular sports including cricket, badminton, carrom, running, and kabaddi. Playground activities for all age groups.",
      icon: "🏅",
      imageUrl: `${IMG}/img-8-playground.jpg`,
    },
    {
      title: "Spacious Campus",
      description: "Growing campus with classrooms, activity areas, and space for events and assemblies.",
      icon: "🏫",
      imageUrl: `${IMG}/ecdad21b-0b6a-4838-bd5a-b5a87813f7c4.jpg`,
    },
  ],
  admissionProcess: [
    { step: 1, title: "Visit or Enquire", description: "Parents can visit the school directly at New Colony, Bettiah, or fill the online enquiry form from this website." },
    { step: 2, title: "Submit Details", description: "Share the student's details, previous school records, and required documents at the office or via the online form." },
    { step: 3, title: "Interaction / Test", description: "For selected classes, a brief interaction or online screening test may be conducted." },
    { step: 4, title: "Confirm Admission", description: "Complete fee payment and receive confirmation. Our team will guide you through every step." },
  ],
  feeStructure: [
    { grade: "Nursery - UKG", admission: "₹5,000", tuition: "₹800/month", annual: "₹2,000" },
    { grade: "Class 1 - 5", admission: "₹7,000", tuition: "₹1,000/month", annual: "₹2,500" },
    { grade: "Class 6 - 8", admission: "₹8,000", tuition: "₹1,200/month", annual: "₹3,000" },
    { grade: "Class 9 - 10", admission: "₹10,000", tuition: "₹1,500/month", annual: "₹3,500" },
  ],
  documentsRequired: [
    "Birth Certificate",
    "Transfer Certificate (TC) from previous school (if applicable)",
    "Report Card / Mark Sheet of last class attended",
    "4 Passport-size photographs",
    "Aadhaar Card of student and parents",
    "Address Proof",
    "Caste Certificate (if applicable)",
  ],
  aboutContent: {
    history:
      "Rising Star Public School was established in 2022 in New Colony, Bettiah, West Champaran, Bihar. As a young and growing English-medium school, we serve students from Nursery to Class 10th with a focus on trust, quality teaching, and steady development. We may be a startup institution, but our commitment to every child is strong — and we are continuously adding facilities, activities, and opportunities as our school family grows.",
    mission:
      "To provide affordable, quality English-medium education in a safe and caring environment where every child feels valued, learns with confidence, and develops strong character alongside academic skills.",
    vision:
      "To become Bettiah's most trusted growing school — where dedicated teachers, modern facilities, and a supportive community help every student shine academically and personally.",
    principalName: "Bablu Kumar",
    principalMessage:
      "Dear Parents and Students, welcome to Rising Star Public School. As Principal, I am committed to creating a positive learning atmosphere where children enjoy coming to school every day. We focus on clear teaching, regular practice, discipline, and respect. Though our school is young, we are building step by step — stronger academics, better facilities, and more opportunities for our students. Thank you for trusting us with your child's education.",
    principalPhoto: `${IMG}/img-9-principal.jpg`,
    directorName: "Sonu Mishra",
    directorMessage:
      "Welcome to Rising Star Public School. As Director, my goal is to build a school that Bettiah families can trust — with honest communication, caring teachers, and steady improvement every year. We started in 2022 with a vision to give children quality English-medium education close to home. Facilities like transport, computer education, and sports are being expanded as we grow. I invite you to visit our campus and become part of the Rising Star family.",
    directorPhoto: `${IMG}/director-sonu-mishra.png`,
    values: [
      { title: "Excellence", description: "We aim high and encourage every student to do their best.", icon: "🏆" },
      { title: "Integrity", description: "Honesty and fairness guide our actions every day.", icon: "🤝" },
      { title: "Care", description: "Every child is treated with warmth, patience, and respect.", icon: "❤️" },
      { title: "Growth", description: "We believe in learning, improving, and moving forward together.", icon: "🌱" },
      { title: "Discipline", description: "Good habits and self-control build strong futures.", icon: "📏" },
      { title: "Community", description: "Parents, teachers, and students work as one team.", icon: "👪" },
    ],
  },
  academics: {
    methodology: [
      { title: "English Medium Instruction", description: "Core subjects taught in English with clear explanations and regular practice." },
      { title: "Activity-Based Learning", description: "Hands-on activities, group work, and practical exercises to make concepts clear." },
      { title: "Regular Assessments", description: "Unit tests, class tests, and term evaluations to track progress and guide improvement." },
      { title: "Remedial Support", description: "Extra attention for students who need help in specific subjects." },
    ],
    streams: [
      { name: "Core Subjects", subjects: "English, Hindi, Mathematics, Science, Social Science, Computer (Class 5–10)" },
      { name: "Co-curricular", subjects: "Sports, Arts, Cultural Programs, Quiz & Competitions" },
      { name: "Values & Life Skills", subjects: "Discipline, Communication, Teamwork, and Character Building" },
    ],
  },
};

const pastEvents = [
  {
    title: "Annual Sports Day 2025",
    date: new Date("2025-12-15"),
    description:
      "A full-day sports celebration with cricket, badminton, carrom, running races, and kabaddi. Nursery to Class 5 competed standard-wise; older students participated in team events. Certificates awarded to winners.",
    isUpcoming: false,
    imageUrl: `${IMG}/81a5ff6a-8f37-45bb-9e29-5d624bdc6046.jpg`,
  },
  {
    title: "Inter-Class Cricket Tournament",
    date: new Date("2025-11-20"),
    description: "Class-wise cricket matches promoting teamwork and sportsmanship. Students from Class 4 onwards participated enthusiastically.",
    isUpcoming: false,
    imageUrl: `${IMG}/e89a1534-e26b-4a49-a60e-bf133a7a5218.jpg`,
  },
  {
    title: "Badminton & Carrom Competition",
    date: new Date("2025-10-08"),
    description: "Indoor sports event featuring badminton singles/doubles and carrom tournaments. Open participation with prizes for top performers.",
    isUpcoming: false,
    imageUrl: `${IMG}/388ccf81-60d1-402d-87a7-e6d3fd534ba9.jpg`,
  },
  {
    title: "Kabaddi & Running Race Day",
    date: new Date("2025-09-18"),
    description: "Traditional kabaddi matches and sprint races for Nursery to Class 5 (standard-wise groups) and Class 6–10 students.",
    isUpcoming: false,
    imageUrl: `${IMG}/4a8f3696-3218-45d2-95e1-9b929d13fc15.jpg`,
  },
  {
    title: "Independence Day Celebration 2025",
    date: new Date("2025-08-15"),
    description: "Flag hoisting, patriotic songs, speeches, and cultural performances by students across all classes.",
    isUpcoming: false,
    imageUrl: `${IMG}/022d2833-5663-4390-90e2-c5e35cf87dcb.jpg`,
  },
  {
    title: "Teachers' Day Celebration 2025",
    date: new Date("2025-09-05"),
    description: "Students organized a heartfelt program to honour teachers with songs, cards, and speeches.",
    isUpcoming: false,
    imageUrl: `${IMG}/29d566bc-a5d5-47fe-a9a0-5d4d044545e9.jpg`,
  },
];

const announcements = [
  { text: "📢 Admissions Open for 2026–27 — Nursery to Class 10 | Apply Online or Visit School", order: 1 },
  { text: "🏫 English Medium School in Bettiah | Call: +91 7366056048", order: 2 },
  { text: "💻 Computer Lab for Class 5–10 | 🚌 Transport Facility Available", order: 3 },
  { text: "📝 Online Screening Test available for Class 5–10 admission applicants", order: 4 },
];

const faculty = [
  { name: "Bablu Kumar", designation: "Principal", subject: "School Administration", qualification: "B.Ed.", order: 1, imageUrl: `${IMG}/img-9-principal.jpg` },
  { name: "Mrs. Priya Singh", designation: "Senior Teacher", subject: "English", qualification: "M.A., B.Ed.", order: 2 },
  { name: "Mr. Rajesh Tiwari", designation: "Teacher", subject: "Mathematics", qualification: "B.Sc., B.Ed.", order: 3 },
  { name: "Mrs. Sunita Devi", designation: "Teacher", subject: "Hindi", qualification: "M.A. Hindi, B.Ed.", order: 4 },
  { name: "Mr. Amit Kumar", designation: "Teacher", subject: "Science", qualification: "B.Sc., B.Ed.", order: 5 },
  { name: "Mrs. Neha Sharma", designation: "Teacher", subject: "Social Science", qualification: "M.A., B.Ed.", order: 6 },
  { name: "Mr. Deepak Yadav", designation: "Sports Instructor", subject: "Physical Education", qualification: "B.P.Ed.", order: 7 },
  { name: "Mrs. Ritu Kumari", designation: "Teacher", subject: "Computer Science", qualification: "B.C.A., B.Ed.", order: 8 },
];

const testimonials = [
  { name: "Sunita Devi", role: "Parent, Class 3", quote: "Rising Star is a trusted school in Bettiah. My child has improved a lot in English and confidence since joining." },
  { name: "Ramesh Kumar", role: "Parent, Class 7", quote: "The teachers are caring and approachable. Regular parent meetings help us stay updated on our child's progress." },
  { name: "Anita Kumari", role: "Parent, Nursery", quote: "Safe environment for young children. The staff treats every child with love and patience. Happy with our choice." },
];

function galleryFromFolder() {
  const dir = path.join(__dirname, "..", "..", "Frontend", "public", "school-images");
  if (!fs.existsSync(dir)) return [];

  const categoryMap = {
    "img-1": "Classroom",
    "img-3": "Classroom",
    "img-4": "Sports",
    "img-5": "Classroom",
    "img-6": "Campus",
    "img-7": "Classroom",
    "img-8": "Sports",
    "img-9": "Campus",
    director: "Campus",
    principal: "Campus",
    flyer: "Events",
    "022d2833": "Campus",
    "29d566bc": "Classroom",
    "388ccf81": "Sports",
    "4a8f3696": "Sports",
    "6bcc785f": "Classroom",
    "81a5ff6a": "Sports",
    d7669cbe: "Campus",
    e0406a55: "Classroom",
    e89a1534: "Events",
    ecdad21b: "Campus",
    images1: "Classroom",
    "images 3": "Classroom",
    "download 4": "Sports",
    "images 5": "Classroom",
    "images 6": "Campus",
    "image 7": "Classroom",
    "images 8": "Sports",
    "download 9": "Campus",
  };

  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map((file) => {
      const key = Object.keys(categoryMap).find((k) => file.includes(k));
      const category = (key && categoryMap[key]) || "Campus";
      const alt = file.replace(/\.[^.]+$/, "").replace(/-/g, " ");
      return { imageUrl: `${IMG}/${file}`, category, alt: alt.charAt(0).toUpperCase() + alt.slice(1) };
    });
}

function buildTests() {
  return [5, 6, 7, 8, 9, 10].map((n) => ({
    title: `Class ${n} Online Screening Test`,
    className: `Class ${n}`,
    description: `30 MCQ questions covering Mathematics, Science, and General Knowledge for Class ${n} admission screening.`,
    durationMinutes: 45,
    questions: buildQuestions(n),
    isActive: true,
  }));
}

async function patch() {
  await connectDB();

  await SiteSettings.deleteMany({});
  await SiteSettings.create(siteSettings);
  console.log("Site settings updated.");

  await Event.deleteMany({});
  await Event.insertMany(pastEvents);
  console.log("Events updated (past sports history, no upcoming).");

  await GalleryImage.deleteMany({});
  const gallery = galleryFromFolder();
  if (gallery.length) {
    await GalleryImage.insertMany(gallery);
    console.log(`Gallery updated with ${gallery.length} images.`);
  }

  await Announcement.deleteMany({});
  await Announcement.insertMany(announcements);
  console.log("Announcements updated.");

  await Faculty.deleteMany({});
  await Faculty.insertMany(faculty);
  console.log("Faculty updated.");

  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);
  console.log("Testimonials updated.");

  await Test.deleteMany({});
  await Test.insertMany(buildTests());
  console.log("Online tests created for Class 5–10 (30 questions each).");

  console.log("Real school data patch complete.");
  process.exit(0);
}

patch().catch((err) => {
  console.error("Patch failed:", err);
  process.exit(1);
});
