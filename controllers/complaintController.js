const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      studentId: req.user._id,
      status: 'Pending',
    });

    await complaint.populate('studentId', 'name email studentId department');

    res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint,
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error while creating complaint.' });
  }
};

// @desc    Get current student's complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const filter = { studentId: req.user._id };

    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints.' });
  }
};

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
// @access  Private (Admin)
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('studentId', 'name email studentId department')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Dashboard stats
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = { Pending: 0, 'In Progress': 0, Resolved: 0, Total: total };
    stats.forEach((s) => {
      statsMap[s._id] = s.count;
    });
    // Total from all (not filtered)
    const overallTotal = await Complaint.countDocuments({});
    statsMap.Total = overallTotal;

    res.json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      stats: statsMap,
    });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints.' });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'studentId',
      'name email studentId department'
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    // Students can only view their own complaints
    if (
      req.user.role === 'student' &&
      complaint.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint.' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Get complaint by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.status(500).json({ message: 'Server error.' });
  }
};

// @desc    Update complaint (Admin updates status; students cannot update)
// @route   PUT /api/complaints/:id
// @access  Private (Admin)
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    const { status, adminNote } = req.body;

    if (status) complaint.status = status;
    if (adminNote !== undefined) complaint.adminNote = adminNote;

    await complaint.save();
    await complaint.populate('studentId', 'name email studentId department');

    res.json({
      message: 'Complaint updated successfully!',
      complaint,
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Server error while updating complaint.' });
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Student: own pending only; Admin: any)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (req.user.role === 'student') {
      if (complaint.studentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this complaint.' });
      }
      if (complaint.status !== 'Pending') {
        return res
          .status(400)
          .json({ message: 'You can only delete complaints with Pending status.' });
      }
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully.' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error while deleting complaint.' });
  }
};

// @desc    Get dashboard stats (Admin)
// @route   GET /api/complaints/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, resolved, byCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({ total, pending, inProgress, resolved, byCategory });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching stats.' });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getStats,
};
