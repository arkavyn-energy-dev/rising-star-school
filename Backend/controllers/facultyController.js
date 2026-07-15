const Faculty = require("../models/Faculty");
const asyncHandler = require("../utils/asyncHandler");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get all active faculty (public), sorted by display order
// @route   GET /api/faculty
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ success: true, count: faculty.length, data: faculty });
});

// @desc    Create a faculty member
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = asyncHandler(async (req, res) => {
  const { name, designation, subject, qualification, order } = req.body;

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/faculty");
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const faculty = await Faculty.create({
    name,
    designation,
    subject,
    qualification,
    order,
    imageUrl,
    imagePublicId,
  });

  res.status(201).json({ success: true, data: faculty });
});

// @desc    Update a faculty member
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty member not found");
  }

  const { name, designation, subject, qualification, order, isActive } = req.body;

  if (req.file) {
    await deleteFromCloudinary(faculty.imagePublicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/faculty");
    faculty.imageUrl = result.secure_url;
    faculty.imagePublicId = result.public_id;
  }

  faculty.name = name ?? faculty.name;
  faculty.designation = designation ?? faculty.designation;
  faculty.subject = subject ?? faculty.subject;
  faculty.qualification = qualification ?? faculty.qualification;
  faculty.order = order ?? faculty.order;
  faculty.isActive = isActive ?? faculty.isActive;

  await faculty.save();

  res.status(200).json({ success: true, data: faculty });
});

// @desc    Delete a faculty member
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    res.status(404);
    throw new Error("Faculty member not found");
  }

  await deleteFromCloudinary(faculty.imagePublicId);
  await faculty.deleteOne();

  res.status(200).json({ success: true, message: "Faculty member removed" });
});

module.exports = { getFaculty, createFaculty, updateFaculty, deleteFaculty };
