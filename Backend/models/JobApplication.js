const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    subjectSpecialization: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "shortlisted", "rejected", "hired"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
