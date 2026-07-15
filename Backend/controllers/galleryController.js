const GalleryImage = require("../models/GalleryImage");
const asyncHandler = require("../utils/asyncHandler");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get gallery images, optionally filtered by ?category=
// @route   GET /api/gallery
// @access  Public
const getGalleryImages = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: images.length, data: images });
});

// @desc    Upload a gallery image
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryImage = asyncHandler(async (req, res) => {
  const { category, alt } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("An image file is required");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/gallery");

  const image = await GalleryImage.create({
    category,
    alt,
    imageUrl: result.secure_url,
    imagePublicId: result.public_id,
  });

  res.status(201).json({ success: true, data: image });
});

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  await deleteFromCloudinary(image.imagePublicId);
  await image.deleteOne();

  res.status(200).json({ success: true, message: "Image removed" });
});

module.exports = { getGalleryImages, createGalleryImage, deleteGalleryImage };
