const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter } = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const eventRoutes = require("./routes/eventRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const testRoutes = require("./routes/testRoutes");
const testAttemptRoutes = require("./routes/testAttemptRoutes");

connectDB();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet());

// CORS — only the configured frontend origin(s) may call this API with credentials.
const parseAllowedOrigins = () => {
  const raw = process.env.CLIENT_URL || "";
  return raw
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
};

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? (origin, callback) => {
        const allowed = parseAllowedOrigins();
        if (!origin || allowed.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    : /^http:\/\/localhost:\d+$/;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Rising Star School API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/careers", jobApplicationRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-attempts", testAttemptRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Fail loudly instead of leaving the process in a broken state.
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
