const mongoose = require('mongoose');

const CATEGORIES = [
  'Classroom',
  'Laboratory',
  'Library',
  'Hostel',
  'Canteen',
  'Washrooms',
  'Infrastructure',
  'Other',
];

const STATUSES = ['Pending', 'In Progress', 'Resolved'];

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category selected',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: {
        values: STATUSES,
        message: 'Invalid status',
      },
      default: 'Pending',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required'],
    },
    adminNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Admin note cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Virtual for formatted date
complaintSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
});

module.exports = mongoose.model('Complaint', complaintSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.STATUSES = STATUSES;
