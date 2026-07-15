const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((o) => o && o.trim()),
        message: "Each question must have exactly 4 non-empty options",
      },
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
  },
  { _id: false }
);

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    durationMinutes: { type: Number, default: 20, min: 1 },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "A test must have at least one question",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testSchema.index({ className: 1, isActive: 1 });

// Strips correct answers before sending a test to a student taking it —
// only used on public-facing routes.
testSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  obj.questions = obj.questions.map(({ questionText, options }) => ({ questionText, options }));
  return obj;
};

module.exports = mongoose.model("Test", testSchema);
