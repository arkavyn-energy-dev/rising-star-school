const mongoose = require("mongoose");

const admissionEnquirySchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    parentName: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    grade: { type: String, required: true, trim: true },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionEnquiry", admissionEnquirySchema);
