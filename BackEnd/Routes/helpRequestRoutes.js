const express = require('express');
const router = express.Router();
const {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest
} = require('../Controllers/helpRequestController');

// POST - Create new help request
router.post('/help-requests', createHelpRequest);

// GET - Get all help requests
router.get('/help-requests', getAllHelpRequests);

// GET - Get help request by ID
router.get('/help-requests/:id', getHelpRequestById);

// PUT - Update help request status
router.put('/help-requests/:id/status', updateHelpRequestStatus);

// DELETE - Delete help request
router.delete('/help-requests/:id', deleteHelpRequest);

module.exports = router;
