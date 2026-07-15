const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    isUpcoming: { type: Boolean, default: true },
    isOpenToAll: { type: Boolean, default: false },
    hasCertificate: { type: Boolean, default: false },
    hasPrizes: { type: Boolean, default: false },
    registrationFee: { type: String, default: "Free" },
    prizeDetails: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

eventSchema.index({ date: -1 });

module.exports = mongoose.model("Event", eventSchema);
