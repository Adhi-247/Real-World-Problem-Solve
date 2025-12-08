const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema({
  // Reporter Information
  reporterName: {
    type: String,
    required: true,
    trim: true
  },
  reporterPhone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Missing Person Information
  missingPersonName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  
  // Last Seen Information
  lastSeenLocation: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  lastSeenDate: {
    type: Date,
    required: true
  },
  lastSeenTime: {
    type: String,
    trim: true
  },
  
  // Physical Description
  height: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  clothingDescription: {
    type: String,
    trim: true
  },
  identifyingFeatures: {
    type: String,
    trim: true
  },
  
  // Additional Information
  additionalInfo: {
    type: String,
    trim: true
  },
  
  // Photo URL or path
  photo: {
    type: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['missing', 'found', 'investigating'],
    default: 'missing'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MissingPerson', missingPersonSchema);
