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

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get Admin By ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    
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

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { username, email, adminId, department, status } = req.body;
    
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    // Check if username or email is already taken by another admin
    if (username || email) {
      const existingAdmin = await Admin.findOne({
        _id: { $ne: req.params.id },
        $or: [
          { username: username || admin.username },
          { email: email || admin.email }
        ]
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already taken'
        });
      }
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.adminId = adminId || admin.adminId;
    admin.department = department || admin.department;
    if (status !== undefined) admin.status = status;

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        adminId: admin.adminId,
        department: admin.department,
        status: admin.status
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin not found' 
      });
    }

    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
