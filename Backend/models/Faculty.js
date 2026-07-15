const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

facultySchema.index({ order: 1 });

module.exports = mongoose.model("Faculty", facultySchema);
