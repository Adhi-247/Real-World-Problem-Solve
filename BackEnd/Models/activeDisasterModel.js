const mongoose = require('mongoose');

const activeDisasterSchema = new mongoose.Schema({
  // Disaster Information
  disasterType: {
    type: String,
    required: true,
    enum: ['tsunami', 'floods', 'wildfire', 'landslide', 'cyclone']
  },
  
  // Location Details
  location: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  
  // Urgency Level
  urgency: {
    type: String,
    required: true,
    enum: ['critical', 'high', 'medium', 'low']
  },
  
  // People Affected
  peopleAffected: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Description
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Contact Information
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Images (Base64 encoded)
  images: [{
    type: String
  }],
  
  // Needs
  needs: {
    food: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    medicine: { type: Boolean, default: false },
    shelter: { type: Boolean, default: false },
    clothing: { type: Boolean, default: false },
    blankets: { type: Boolean, default: false },
    firstAid: { type: Boolean, default: false },
    rescue: { type: Boolean, default: false },
    other: { type: String, default: '' }
  },
  
  // Source - where this disaster came from
  source: {
    type: String,
    enum: ['admin', 'admin-approved', 'auto-detected', 'user-report'],
    default: 'admin'
  },
  
  // Reference to original help request (if auto-created)
  helpRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HelpRequest'
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'resolved', 'monitoring'],
    default: 'active'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
activeDisasterSchema.index({ createdAt: -1 });
activeDisasterSchema.index({ urgency: 1 });
activeDisasterSchema.index({ status: 1 });
activeDisasterSchema.index({ disasterType: 1 });
activeDisasterSchema.index({ district: 1 });

module.exports = mongoose.model('ActiveDisaster', activeDisasterSchema);
