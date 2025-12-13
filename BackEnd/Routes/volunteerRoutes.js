const express = require('express');
const router = express.Router();
const {
  submitVolunteerApplication,
  getAllVolunteers,
  getVolunteerById,
  getVolunteersByUserId,
  updateVolunteer,
  updateVolunteerStatus,
  deleteVolunteer
} = require('../Controllers/volunteerController');

// Volunteer routes
router.post('/', submitVolunteerApplication);
router.get('/', getAllVolunteers);
router.get('/:id', getVolunteerById);
router.get('/user/:userId', getVolunteersByUserId);
router.put('/:id', updateVolunteer);
router.put('/:id/status', updateVolunteerStatus);
router.delete('/:id', deleteVolunteer);

module.exports = router;
