const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
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
  
  // What They Need
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
  
  // Situation Description
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Images (URLs or paths)
  images: [{
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'rejected'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
helpRequestSchema.index({ createdAt: -1 }); // For sorting by date
helpRequestSchema.index({ urgency: 1 }); // For filtering by urgency
helpRequestSchema.index({ status: 1 }); // For filtering by status
helpRequestSchema.index({ disasterType: 1 }); // For filtering by type
helpRequestSchema.index({ district: 1 }); // For location-based queries

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
