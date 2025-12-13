const express = require('express');
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} = require('../Controllers/adminController');

// Admin routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', getAdminProfile);
router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
