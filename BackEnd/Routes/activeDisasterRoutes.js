const express = require('express');
const router = express.Router();
const {
  getAllActiveDisasters,
  getActiveDisasterById,
  createActiveDisaster,
  updateDisasterStatus,
  deleteActiveDisaster,
  getDisasterStats
} = require('../Controllers/activeDisasterController');

// Get all active disasters
router.get('/', getAllActiveDisasters);

// Get disaster statistics
router.get('/stats', getDisasterStats);

// Get disaster by ID
router.get('/:id', getActiveDisasterById);

// Create new disaster (Admin)
router.post('/', createActiveDisaster);

// Update disaster status
router.patch('/:id/status', updateDisasterStatus);

// Delete disaster
router.delete('/:id', deleteActiveDisaster);

module.exports = router;
