const Testimonial = require("../models/Testimonial");
const asyncHandler = require("../utils/asyncHandler");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get active testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = asyncHandler(async (req, res) => {
  const { name, role, quote } = req.body;

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/testimonials");
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const testimonial = await Testimonial.create({ name, role, quote, imageUrl, imagePublicId });

  res.status(201).json({ success: true, data: testimonial });
});

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  const { name, role, quote, isActive } = req.body;

  if (req.file) {
    await deleteFromCloudinary(testimonial.imagePublicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/testimonials");
    testimonial.imageUrl = result.secure_url;
    testimonial.imagePublicId = result.public_id;
  }

  testimonial.name = name ?? testimonial.name;
  testimonial.role = role ?? testimonial.role;
  testimonial.quote = quote ?? testimonial.quote;
  testimonial.isActive = isActive ?? testimonial.isActive;

  await testimonial.save();

  res.status(200).json({ success: true, data: testimonial });
});

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error("Testimonial not found");
  }

  await deleteFromCloudinary(testimonial.imagePublicId);
  await testimonial.deleteOne();

  res.status(200).json({ success: true, message: "Testimonial removed" });
});

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
