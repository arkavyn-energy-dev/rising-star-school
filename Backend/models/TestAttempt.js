const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true, index: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    testTitle: { type: String, required: true },
    studentName: { type: String, required: true, trim: true },
    studentClass: { type: String, required: true, trim: true },
    parentName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    answers: { type: [Number], default: [] },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },
    notifiedAt: { type: Date },
  },
  { timestamps: true }
);

testAttemptSchema.index({ test: 1, status: 1 });

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
