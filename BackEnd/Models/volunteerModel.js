const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    enum: ['Weekdays', 'Weekends', 'Both', 'Anytime'],
    required: true
  },
  experienceYears: {
    type: Number,
    default: 0
  },
  previousExperience: {
    type: String,
    default: ''
  },
  emergencyContactName: {
    type: String,
    required: true
  },
  emergencyContactPhone: {
    type: String,
    required: true
  },
  reasonToVolunteer: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
