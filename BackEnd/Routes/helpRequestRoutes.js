const express = require('express');
const router = express.Router();
const {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest,
  approveAsActiveDisaster,
  rejectAsActiveDisaster,
  getPendingApprovals
} = require('../Controllers/helpRequestController');

// POST - Create new help request
router.post('/help-requests', createHelpRequest);

// GET - Get all help requests
router.get('/help-requests', getAllHelpRequests);

// GET - Get pending disaster approvals (MUST be before /:id route)
router.get('/help-requests/pending-approvals', getPendingApprovals);

// POST - Approve help request as active disaster (MUST be before /:id route)
router.post('/help-requests/:id/approve-disaster', approveAsActiveDisaster);

// POST - Reject help request as disaster (MUST be before /:id route)
router.post('/help-requests/:id/reject-disaster', rejectAsActiveDisaster);

// PUT - Update help request status
router.put('/help-requests/:id/status', updateHelpRequestStatus);

// GET - Get help request by ID
router.get('/help-requests/:id', getHelpRequestById);

// DELETE - Delete help request
router.delete('/help-requests/:id', deleteHelpRequest);

module.exports = router;
