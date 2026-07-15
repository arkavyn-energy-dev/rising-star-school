// One-time seed script — loads the exact same school content that used to
// live in the old Next.js `content.ts` file into MongoDB.
//
// Usage:
//   npm run seed            -> inserts data (skips collections that already have data)
//   npm run seed:destroy    -> wipes all seeded collections

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const AdminUser = require("../models/AdminUser");
const Faculty = require("../models/Faculty");
const Event = require("../models/Event");
const GalleryImage = require("../models/GalleryImage");
const Testimonial = require("../models/Testimonial");
const Announcement = require("../models/Announcement");
const SiteSettings = require("../models/SiteSettings");
const Test = require("../models/Test");

const faculty = [
  { name: "Dr. Ramesh Prasad", designation: "Principal", subject: "Education Administration", qualification: "Ph.D. in Education", order: 1 },
  { name: "Mrs. Sunita Verma", designation: "Vice Principal", subject: "Mathematics", qualification: "M.Sc., B.Ed.", order: 2 },
  { name: "Mr. Arvind Singh", designation: "Senior Teacher", subject: "Physics", qualification: "M.Sc. Physics, B.Ed.", order: 3 },
  { name: "Mrs. Kavita Rani", designation: "Senior Teacher", subject: "English Literature", qualification: "M.A. English, B.Ed.", order: 4 },
  { name: "Mr. Sanjay Tiwari", designation: "Teacher", subject: "Chemistry", qualification: "M.Sc. Chemistry, B.Ed.", order: 5 },
  { name: "Mrs. Neelam Gupta", designation: "Teacher", subject: "Hindi", qualification: "M.A. Hindi, B.Ed.", order: 6 },
  { name: "Mr. Deepak Yadav", designation: "Sports Coach", subject: "Physical Education", qualification: "B.P.Ed.", order: 7 },
  { name: "Mrs. Ritu Kumari", designation: "Teacher", subject: "Computer Science", qualification: "M.C.A., B.Ed.", order: 8 },
];

const events = [
  { title: "Annual Sports Day", date: new Date("2026-05-15"), description: "Join us for an exciting day of athletic competitions, team events, and celebrations of sportsmanship.", isUpcoming: true },
  { title: "Science Exhibition", date: new Date("2026-06-20"), description: "Students showcase their innovative science projects and experiments. Open to all parents and visitors.", isUpcoming: true },
  {
    title: "Inter-School Talent Hunt 2026",
    date: new Date("2026-09-12"),
    description: "An open competition for singing, dancing, painting, and elocution. Students from Rising Star as well as other schools are welcome to participate — no registration fee required.",
    isUpcoming: true,
    isOpenToAll: true,
    hasCertificate: true,
    hasPrizes: true,
    registrationFee: "Free",
    prizeDetails: "Cash prizes and trophies for winners; participation certificates for all.",
  },
  { title: "Independence Day Celebration", date: new Date("2026-08-15"), description: "Flag hoisting ceremony followed by cultural programs, patriotic songs, and speeches by students.", isUpcoming: true },
  { title: "Annual Day 2025", date: new Date("2025-12-20"), description: "A grand celebration featuring cultural performances, prize distribution, and a special guest appearance.", isUpcoming: false },
  { title: "Inter-School Quiz Competition", date: new Date("2025-11-10"), description: "Our students won first place in the district-level inter-school quiz competition.", isUpcoming: false },
  { title: "Teachers' Day Celebration", date: new Date("2025-09-05"), description: "Students organized a heartfelt celebration honoring our dedicated teachers.", isUpcoming: false },
];

const galleryImages = [
  { category: "Campus", alt: "School Building" },
  { category: "Classroom", alt: "Classroom" },
  { category: "Sports", alt: "Sports Day" },
  { category: "Events", alt: "Assembly Hall" },
  { category: "Campus", alt: "Science Lab" },
  { category: "Campus", alt: "Library" },
  { category: "Classroom", alt: "Students Learning" },
  { category: "Sports", alt: "Sports Event" },
  { category: "Sports", alt: "Athletics" },
  { category: "Events", alt: "School Event" },
  { category: "Classroom", alt: "Classroom Activity" },
  { category: "Campus", alt: "Library Reading" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Parent, Class 8", quote: "Rising Star has been a wonderful journey for my child. The teachers are incredibly supportive and the school truly focuses on overall development." },
  { name: "Rajesh Kumar", role: "Parent, Class 12", quote: "My son scored 95% in his board exams thanks to the excellent guidance from the faculty. Highly recommend this school to every parent." },
  { name: "Anita Devi", role: "Parent, Class 5", quote: "The school provides a perfect balance of academics and extracurricular activities. My daughter loves going to school every day!" },
];

const tests = [
  {
    title: "Class 5 Admission Screening Test",
    className: "Class 5",
    description: "A short general knowledge and reasoning assessment for students seeking admission to Class 5.",
    durationMinutes: 15,
    questions: [
      {
        questionText: "Which is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Mars", "Saturn"],
        correctOptionIndex: 1,
      },
      {
        questionText: "What is 12 x 8?",
        options: ["86", "96", "106", "92"],
        correctOptionIndex: 1,
      },
      {
        questionText: "Who wrote the Indian National Anthem?",
        options: ["Mahatma Gandhi", "Rabindranath Tagore", "Bankim Chandra", "Sarojini Naidu"],
        correctOptionIndex: 1,
      },
      {
        questionText: "Which is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correctOptionIndex: 2,
      },
      {
        questionText: "The capital of India is:",
        options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    title: "Class 9 Admission Screening Test",
    className: "Class 9",
    description: "A screening test covering basic Mathematics, Science, and English for Class 9 admission.",
    durationMinutes: 20,
    questions: [
      {
        questionText: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "HO2"],
        correctOptionIndex: 0,
      },
      {
        questionText: "Solve: (15 + 5) / 4",
        options: ["4", "5", "6", "20"],
        correctOptionIndex: 1,
      },
      {
        questionText: "Choose the correct synonym for 'Happy':",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correctOptionIndex: 1,
      },
      {
        questionText: "Which gas do plants absorb from the atmosphere for photosynthesis?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctOptionIndex: 2,
      },
      {
        questionText: "What is the square root of 144?",
        options: ["11", "12", "13", "14"],
        correctOptionIndex: 1,
      },
    ],
  },
];

const announcements = [
  { text: "📢 Admissions open for 2026-27 session — Apply Now!", order: 1 },
  { text: "🏆 Congratulations to our students for outstanding Board results!", order: 2 },
  { text: "📅 Annual Sports Day — 15th May 2026", order: 3 },
  { text: "📚 Parent-Teacher Meeting scheduled for 20th April 2026", order: 4 },
];

const siteSettings = {
  schoolName: "Rising Star Public School",
  tagline: "Nurturing Minds, Shaping Futures",
  description:
    "Rising Star Public School is a leading educational institution in Bihar offering quality education from Nursery to Class 12th with a focus on holistic development.",
  phone: "+91 98765 43210",
  email: "info@risingstarschool.edu.in",
  address: "Rising Star Campus, Main Road, Bihar, India",
  timings: "Mon - Sat: 8:00 AM - 3:00 PM",
  establishedYear: 2010,
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.123!2d85.1376!3d25.6117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDM2JzQyLjEiTiA4NcKwMDgnMTUuNCJF!5e0!3m2!1sen!2sin!4v1",
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  stats: [
    { label: "Students", value: 1500, suffix: "+" },
    { label: "Teachers", value: 80, suffix: "+" },
    { label: "Years of Excellence", value: 15, suffix: "+" },
    { label: "Awards Won", value: 50, suffix: "+" },
  ],
  programs: [
    { title: "Pre-Primary", grades: "Nursery - KG", description: "A nurturing environment where young learners develop foundational skills through play-based learning and creative activities." },
    { title: "Primary School", grades: "Class 1 - 5", description: "Building strong academic foundations with a balanced curriculum that encourages curiosity and critical thinking." },
    { title: "Middle School", grades: "Class 6 - 8", description: "Developing analytical skills and subject expertise through hands-on learning and project-based activities." },
    { title: "Secondary School", grades: "Class 9 - 10", description: "Comprehensive preparation for board examinations with a focus on conceptual clarity and exam strategies." },
    { title: "Senior Secondary", grades: "Class 11 - 12", description: "Specialized streams in Science, Commerce, and Arts with expert faculty guiding students towards their career goals." },
    { title: "Sports & Arts", grades: "All Classes", description: "A vibrant co-curricular program including sports, music, dance, art, and other creative pursuits for holistic development." },
  ],
  whyChooseUs: [
    { title: "Experienced Faculty", description: "Our team of 80+ qualified and dedicated teachers bring years of expertise to every classroom.", icon: "👨‍🏫" },
    { title: "Modern Campus", description: "State-of-the-art facilities including smart classrooms, science labs, computer labs, and a well-stocked library.", icon: "🏫" },
    { title: "Holistic Development", description: "Beyond academics — sports, arts, cultural activities, and leadership programs for all-round growth.", icon: "🌟" },
    { title: "Safe Environment", description: "CCTV monitored campus, trained staff, and strict safety protocols ensuring a secure learning environment.", icon: "🛡️" },
  ],
  facilities: [
    { title: "Bus & Van Service", description: "Safe and reliable door-to-door transportation with GPS-tracked buses and vans covering all major routes around the city.", icon: "🚌" },
    { title: "Computer Lab (Class 5-10)", description: "Dedicated computer education for students from Class 5th to 10th, with hands-on training on modern systems and software.", icon: "💻" },
    { title: "Sports & Events", description: "Regular sports activities, annual tournaments, and inter-school events to encourage teamwork, fitness, and healthy competition.", icon: "🏅" },
  ],
  admissionProcess: [
    { step: 1, title: "Enquiry", description: "Visit the school or fill out the online enquiry form to get started." },
    { step: 2, title: "Application", description: "Submit the application form along with required documents." },
    { step: 3, title: "Interaction", description: "Student and parent interaction with the admission committee." },
    { step: 4, title: "Confirmation", description: "Receive admission confirmation and complete fee payment." },
  ],
  feeStructure: [
    { grade: "Nursery - KG", admission: "₹15,000", tuition: "₹3,000/month", annual: "₹5,000" },
    { grade: "Class 1 - 5", admission: "₹20,000", tuition: "₹3,500/month", annual: "₹6,000" },
    { grade: "Class 6 - 8", admission: "₹25,000", tuition: "₹4,000/month", annual: "₹7,000" },
    { grade: "Class 9 - 10", admission: "₹30,000", tuition: "₹4,500/month", annual: "₹8,000" },
    { grade: "Class 11 - 12", admission: "₹35,000", tuition: "₹5,000/month", annual: "₹10,000" },
  ],
  documentsRequired: [
    "Birth Certificate",
    "Transfer Certificate (TC) from previous school",
    "Report Card / Mark Sheet of last class attended",
    "4 Passport-size photographs",
    "Aadhaar Card of student and parents",
    "Address Proof",
    "Caste Certificate (if applicable)",
  ],
  aboutContent: {
    history:
      "Established in 2010, Rising Star Public School has been a beacon of quality education in Bihar. What started as a small institution with just 50 students has grown into a thriving educational campus with over 1,500 students. Our commitment to academic excellence and holistic development has made us one of the most trusted schools in the region.",
    mission:
      "To provide an inclusive, stimulating, and supportive learning environment that empowers every student to achieve their fullest potential and become responsible citizens of tomorrow.",
    vision:
      "To be a leading center of educational excellence that nurtures creativity, critical thinking, and character, preparing students to thrive in a rapidly changing world.",
    principalName: "Dr. Ramesh Prasad",
    principalMessage:
      "Dear Parents and Students, at Rising Star Public School, we believe that every child is unique and has the potential to shine. Our dedicated team of educators works tirelessly to create an environment where students are encouraged to explore, question, and grow. We are committed to providing not just academic excellence, but also the values and skills needed to succeed in life. I invite you to be a part of our Rising Star family.",
    directorName: "Mr. Suresh Kumar",
    directorMessage:
      "Welcome to Rising Star Public School. As Director, my vision is to build an institution where every child feels valued, supported, and inspired to reach their full potential. We continuously invest in better infrastructure, safer transport, modern learning tools, and well-trained staff so that our students are always a step ahead. Thank you for trusting us with your child's future.",
    values: [
      { title: "Excellence", description: "We strive for the highest standards in everything we do.", icon: "🏆" },
      { title: "Integrity", description: "We uphold honesty, transparency, and ethical behavior.", icon: "🤝" },
      { title: "Innovation", description: "We embrace new ideas and creative approaches to learning.", icon: "💡" },
      { title: "Respect", description: "We value diversity and treat everyone with dignity and respect.", icon: "🙏" },
      { title: "Compassion", description: "We care for the well-being of every member of our community.", icon: "❤️" },
      { title: "Responsibility", description: "We encourage accountability and civic responsibility.", icon: "🌍" },
    ],
  },
  academics: {
    methodology: [
      { title: "Interactive Learning", description: "Smart classrooms with digital teaching aids for engaging, visual learning experiences." },
      { title: "Activity-Based Education", description: "Hands-on activities, experiments, and projects that make concepts come alive." },
      { title: "Regular Assessments", description: "Continuous evaluation through tests, quizzes, and assignments to track progress." },
      { title: "Remedial Classes", description: "Additional support for students who need extra attention in specific subjects." },
    ],
    streams: [
      { name: "Science", subjects: "Physics, Chemistry, Biology/Mathematics, English, Computer Science" },
      { name: "Commerce", subjects: "Accountancy, Business Studies, Economics, English, Mathematics/IP" },
      { name: "Arts", subjects: "History, Political Science, Geography, English, Hindi/Economics" },
    ],
  },
};

const destroyData = async () => {
  await Promise.all([
    Faculty.deleteMany(),
    Event.deleteMany(),
    GalleryImage.deleteMany(),
    Testimonial.deleteMany(),
    Announcement.deleteMany(),
    SiteSettings.deleteMany(),
    Test.deleteMany(),
  ]);
  console.log("All seeded collections destroyed.");
};

const importData = async () => {
  const [facultyCount, eventCount, galleryCount, testimonialCount, announcementCount, settingsCount, testCount] =
    await Promise.all([
      Faculty.countDocuments(),
      Event.countDocuments(),
      GalleryImage.countDocuments(),
      Testimonial.countDocuments(),
      Announcement.countDocuments(),
      SiteSettings.countDocuments(),
      Test.countDocuments(),
    ]);

  if (facultyCount === 0) await Faculty.insertMany(faculty);
  if (eventCount === 0) await Event.insertMany(events);
  if (testimonialCount === 0) await Testimonial.insertMany(testimonials);
  if (announcementCount === 0) await Announcement.insertMany(announcements);
  if (settingsCount === 0) await SiteSettings.create(siteSettings);
  if (testCount === 0) await Test.insertMany(tests);

  // GalleryImage.imageUrl is required (a gallery item without a real photo is
  // meaningless), and we don't have actual photo files to seed yet — so this
  // collection is intentionally left empty. Upload real photos later via
  // POST /api/gallery (multipart form with an "image" file) from the admin panel.
  if (galleryCount === 0) {
    console.log(
      `Skipped seeding ${galleryImages.length} gallery placeholder(s) — no real image files available. Upload actual photos via the admin panel instead.`
    );
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminExists = adminEmail && (await AdminUser.findOne({ email: adminEmail.toLowerCase() }));

  if (!adminExists && adminEmail && process.env.SEED_ADMIN_PASSWORD) {
    await AdminUser.create({
      name: process.env.SEED_ADMIN_NAME || "Admin",
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD,
      role: "superadmin",
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log("Admin account already exists or SEED_ADMIN_* env vars missing — skipped.");
  }

  console.log("Seed data imported successfully.");
  console.log(
    "NOTE: Faculty/Event/Testimonial imageUrl fields are empty — upload real images for them via the admin panel (PUT with an 'image' file) once Cloudinary credentials are configured."
  );
};

const run = async () => {
  await connectDB();

  const shouldDestroy = process.argv.includes("--destroy");

  if (shouldDestroy) {
    await destroyData();
  } else {
    await importData();
  }

  process.exit(0);
};

run().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
