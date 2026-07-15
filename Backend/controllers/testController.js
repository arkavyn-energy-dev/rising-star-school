const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get active tests, optionally filtered by ?className=
// @route   GET /api/tests
// @access  Public (correct answers stripped)
const getTests = asyncHandler(async (req, res) => {
  const { className } = req.query;
  const filter = { isActive: true };
  if (className) filter.className = className;

  const tests = await Test.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: tests.length, data: tests.map((t) => t.toPublicJSON()) });
});

// @desc    Get a single active test by id (correct answers stripped)
// @route   GET /api/tests/:id
// @access  Public
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findOne({ _id: req.params.id, isActive: true });

  if (!test) {
    res.status(404);
    throw new Error("Test not found or no longer active");
  }

  res.status(200).json({ success: true, data: test.toPublicJSON() });
});

// @desc    Get all tests, including inactive (with correct answers)
// @route   GET /api/tests/admin/all
// @access  Private/Admin
const getAllTestsAdmin = asyncHandler(async (req, res) => {
  const tests = await Test.find().sort({ createdAt: -1 });
  const withCounts = await Promise.all(
    tests.map(async (test) => {
      const attemptCount = await TestAttempt.countDocuments({ test: test._id });
      return { ...test.toObject(), attemptCount };
    })
  );
  res.status(200).json({ success: true, count: tests.length, data: withCounts });
});

// @desc    Create a test (class-wise MCQ set)
// @route   POST /api/tests
// @access  Private/Admin
const createTest = asyncHandler(async (req, res) => {
  const { title, className, description, durationMinutes, questions, isActive } = req.body;

  const test = await Test.create({ title, className, description, durationMinutes, questions, isActive });

  res.status(201).json({ success: true, data: test });
});

// @desc    Update a test
// @route   PUT /api/tests/:id
// @access  Private/Admin
const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  const { title, className, description, durationMinutes, questions, isActive } = req.body;

  test.title = title ?? test.title;
  test.className = className ?? test.className;
  test.description = description ?? test.description;
  test.durationMinutes = durationMinutes ?? test.durationMinutes;
  test.questions = questions ?? test.questions;
  test.isActive = isActive ?? test.isActive;

  await test.save();

  res.status(200).json({ success: true, data: test });
});

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  await test.deleteOne();
  await TestAttempt.deleteMany({ test: test._id });

  res.status(200).json({ success: true, message: "Test removed" });
});

module.exports = { getTests, getTestById, getAllTestsAdmin, createTest, updateTest, deleteTest };
