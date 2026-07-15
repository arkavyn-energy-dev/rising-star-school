const Event = require("../models/Event");
const asyncHandler = require("../utils/asyncHandler");
const { uploadBufferToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Get events, optionally filtered by ?type=upcoming|past
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = {};

  if (type === "upcoming") filter.isUpcoming = true;
  if (type === "past") filter.isUpcoming = false;

  const events = await Event.find(filter).sort({ date: -1 });
  res.status(200).json({ success: true, count: events.length, data: events });
});

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    isUpcoming,
    isOpenToAll,
    hasCertificate,
    hasPrizes,
    registrationFee,
    prizeDetails,
  } = req.body;

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/events");
    imageUrl = result.secure_url;
    imagePublicId = result.public_id;
  }

  const event = await Event.create({
    title,
    description,
    date,
    isUpcoming,
    isOpenToAll,
    hasCertificate,
    hasPrizes,
    registrationFee,
    prizeDetails,
    imageUrl,
    imagePublicId,
  });

  res.status(201).json({ success: true, data: event });
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const {
    title,
    description,
    date,
    isUpcoming,
    isOpenToAll,
    hasCertificate,
    hasPrizes,
    registrationFee,
    prizeDetails,
  } = req.body;

  if (req.file) {
    await deleteFromCloudinary(event.imagePublicId);
    const result = await uploadBufferToCloudinary(req.file.buffer, "rising-star-school/events");
    event.imageUrl = result.secure_url;
    event.imagePublicId = result.public_id;
  }

  event.title = title ?? event.title;
  event.description = description ?? event.description;
  event.date = date ?? event.date;
  event.isUpcoming = isUpcoming ?? event.isUpcoming;
  event.isOpenToAll = isOpenToAll ?? event.isOpenToAll;
  event.hasCertificate = hasCertificate ?? event.hasCertificate;
  event.hasPrizes = hasPrizes ?? event.hasPrizes;
  event.registrationFee = registrationFee ?? event.registrationFee;
  event.prizeDetails = prizeDetails ?? event.prizeDetails;

  await event.save();

  res.status(200).json({ success: true, data: event });
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  await deleteFromCloudinary(event.imagePublicId);
  await event.deleteOne();

  res.status(200).json({ success: true, message: "Event removed" });
});

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
