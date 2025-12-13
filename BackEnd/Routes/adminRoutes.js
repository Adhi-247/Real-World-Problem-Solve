const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile } = require('../Controllers/adminController');

// Admin routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', getAdminProfile);

module.exports = router;
