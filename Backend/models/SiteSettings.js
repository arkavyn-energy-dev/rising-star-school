const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: "+" },
  },
  { _id: false }
);

const feeRowSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true },
    admission: { type: String, required: true },
    tuition: { type: String, required: true },
    annual: { type: String, required: true },
  },
  { _id: false }
);

const admissionStepSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const coreValueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const methodologySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const streamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subjects: { type: String, required: true },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    grades: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const whyChooseUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const facilitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, default: "Rising Star Public School" },
    tagline: { type: String, default: "Nurturing Minds, Shaping Futures" },
    description: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    timings: { type: String, default: "" },
    establishedYear: { type: Number },
    mapUrl: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    stats: [statSchema],
    feeStructure: [feeRowSchema],
    admissionProcess: [admissionStepSchema],
    documentsRequired: [{ type: String }],
    programs: [programSchema],
    whyChooseUs: [whyChooseUsSchema],
    facilities: [facilitySchema],
    aboutContent: {
      history: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      principalMessage: { type: String, default: "" },
      principalName: { type: String, default: "" },
      principalPhoto: { type: String, default: "" },
      directorMessage: { type: String, default: "" },
      directorName: { type: String, default: "" },
      directorPhoto: { type: String, default: "" },
      values: [coreValueSchema],
    },
    academics: {
      methodology: [methodologySchema],
      streams: [streamSchema],
    },
  },
  { timestamps: true }
);

// Enforce a single settings document via a fixed identifier.
siteSettingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
