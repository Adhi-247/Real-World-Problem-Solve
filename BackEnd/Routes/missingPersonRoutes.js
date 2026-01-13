const express = require('express');
const router = express.Router();
const {
  reportMissingPerson,
  searchMissingPersons,
  getAllMissingPersons,
  getMissingPersonById,
  updateMissingPersonStatus,
  deleteMissingPerson
} = require('../Controllers/missingPersonController');

// POST - Report new missing person
router.post('/missing-persons', reportMissingPerson);

// GET - Search missing persons with filters
router.get('/missing-persons/search', searchMissingPersons);

// GET - Get all missing persons
router.get('/missing-persons', getAllMissingPersons);

// GET - Get missing person by ID
router.get('/missing-persons/:id', getMissingPersonById);

// PUT - Update missing person status
router.put('/missing-persons/:id/status', updateMissingPersonStatus);

// DELETE - Delete missing person report
router.delete('/missing-persons/:id', deleteMissingPerson);

module.exports = router;
