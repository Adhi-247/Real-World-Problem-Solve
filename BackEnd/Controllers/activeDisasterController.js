const ActiveDisaster = require('../Models/activeDisasterModel');

// Get all active disasters
const getAllActiveDisasters = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, urgency, disasterType } = req.query;
    
    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (disasterType) filter.disasterType = disasterType;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const [disasters, total] = await Promise.all([
      ActiveDisaster.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      ActiveDisaster.countDocuments(filter)
    ]);
    
    res.status(200).json({
      success: true,
      count: disasters.length,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: disasters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active disasters',
      error: error.message
    });
  }
};

// Get disaster by ID
const getActiveDisasterById = async (req, res) => {
  try {
    const disaster = await ActiveDisaster.findById(req.params.id)
      .populate('helpRequestId');
    
    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found'
      });
    }

    res.status(200).json({
      success: true,
      data: disaster
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disaster',
      error: error.message
    });
  }
};

// Create new disaster (Admin)
const createActiveDisaster = async (req, res) => {
  try {
    const {
      disasterType,
      location,
      district,
      address,
      urgency,
      peopleAffected,
      description,
      phone,
      images,
      needs
    } = req.body;

    // Validate required fields
    if (!disasterType || !location || !district || !address || !urgency || !peopleAffected || !description || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const disaster = new ActiveDisaster({
      disasterType,
      location,
      district,
      address,
      urgency,
      peopleAffected,
      description,
      phone,
      images: images || [],
      needs,
      source: 'admin',
      status: 'active'
    });

    await disaster.save();

    res.status(201).json({
      success: true,
      message: 'Active disaster created successfully',
      data: disaster
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create disaster',
      error: error.message
    });
  }
};

// Update disaster status
const updateDisasterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'resolved', 'monitoring'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const disaster = await ActiveDisaster.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: disaster
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update disaster',
      error: error.message
    });
  }
};

// Delete disaster
const deleteActiveDisaster = async (req, res) => {
  try {
    const disaster = await ActiveDisaster.findByIdAndDelete(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Disaster deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete disaster',
      error: error.message
    });
  }
};

// Get disaster statistics
const getDisasterStats = async (req, res) => {
  try {
    const stats = await ActiveDisaster.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$urgency', 'critical'] }, 1, 0] }
          },
          totalAffected: { $sum: '$peopleAffected' }
        }
      }
    ]);

    const typeBreakdown = await ActiveDisaster.aggregate([
      {
        $group: {
          _id: '$disasterType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, active: 0, critical: 0, totalAffected: 0 },
        byType: typeBreakdown
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllActiveDisasters,
  getActiveDisasterById,
  createActiveDisaster,
  updateDisasterStatus,
  deleteActiveDisaster,
  getDisasterStats
};
