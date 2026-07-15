const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Campus", "Classroom", "Sports", "Events"],
      required: true,
    },
    alt: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
