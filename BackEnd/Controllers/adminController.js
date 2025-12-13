const Admin = require('../Models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET || 'your-secret-key-here', {
    expiresIn: '30d'
  });
};

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password, adminId, department } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }, { adminId }] });
    if (adminExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin with this email, username, or admin ID already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      adminId,
      department
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        adminId: admin.adminId,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        adminId: admin.adminId,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
