const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get active announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ success: true, count: announcements.length, data: announcements });
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { text, order } = req.body;
  const announcement = await Announcement.create({ text, order });
  res.status(201).json({ success: true, data: announcement });
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  const { text, order, isActive } = req.body;
  announcement.text = text ?? announcement.text;
  announcement.order = order ?? announcement.order;
  announcement.isActive = isActive ?? announcement.isActive;

  await announcement.save();

  res.status(200).json({ success: true, data: announcement });
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await announcement.deleteOne();

  res.status(200).json({ success: true, message: "Announcement removed" });
});

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
