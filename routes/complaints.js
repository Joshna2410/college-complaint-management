const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getStats,
} = require('../controllers/complaintController');

const { CATEGORIES, STATUSES } = require('../models/Complaint');

// Validation
const complaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required').isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
];

const updateValidation = [
  body('status').optional().isIn(STATUSES).withMessage('Invalid status'),
  body('adminNote').optional().isLength({ max: 500 }).withMessage('Admin note cannot exceed 500 characters'),
];

// Routes
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/my', protect, authorize('student'), getMyComplaints);
router.get('/', protect, authorize('admin'), getAllComplaints);
router.post('/', protect, authorize('student'), complaintValidation, createComplaint);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, authorize('admin'), updateValidation, updateComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;
