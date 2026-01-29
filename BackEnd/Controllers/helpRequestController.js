const HelpRequest = require('../Models/helpRequestModel');
const ActiveDisaster = require('../Models/activeDisasterModel');

// Create new help request (Admin must approve to become active disaster)
const createHelpRequest = async (req, res) => {
  try {
    const {
      name,
      phone,
      disasterType,
      location,
      district,
      address,
      urgency,
      peopleAffected,
      needs,
      description,
      images
    } = req.body;

    // Validate required fields
    if (!name || !phone || !disasterType || !location || !district || !address || !urgency || !peopleAffected || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new help request
    const helpRequest = new HelpRequest({
      name,
      phone,
      disasterType,
      location,
      district,
      address,
      urgency,
      peopleAffected,
      needs,
      description,
      images: images || [],
      status: 'pending',
      disasterApprovalStatus: 'pending' // Awaits admin approval
    });

    // Save help request to database
    await helpRequest.save();

    res.status(201).json({
      success: true,
      message: 'Help request submitted successfully. Admin will review it.',
      data: helpRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit help request',
      error: error.message
    });
  }
};

// Get all help requests with pagination and filtering
const getAllHelpRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, urgency, disasterType, includeImages = 'false' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (disasterType) filter.disasterType = disasterType;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const projection = includeImages === 'true' ? {} : { images: 0 };
    
    const [helpRequests, total] = await Promise.all([
      HelpRequest.find(filter, projection)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      HelpRequest.countDocuments(filter)
    ]);
    
    res.status(200).json({
      success: true,
      count: helpRequests.length,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: helpRequests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch help requests',
      error: error.message
    });
  }
};

// Get help request by ID
const getHelpRequestById = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);
    
    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: helpRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch help request',
      error: error.message
    });
  }
};

// Update help request status
const updateHelpRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'in-progress', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const helpRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: helpRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update help request',
      error: error.message
    });
  }
};

// Delete help request
const deleteHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findByIdAndDelete(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Help request deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete help request',
      error: error.message
    });
  }
};

// APPROVE help request as Active Disaster
const approveAsActiveDisaster = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    // Check if already approved
    if (helpRequest.disasterApprovalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This request is already approved as an active disaster'
      });
    }

    // Create Active Disaster
    const activeDisaster = new ActiveDisaster({
      disasterType: helpRequest.disasterType,
      location: helpRequest.location,
      district: helpRequest.district,
      address: helpRequest.address,
      urgency: helpRequest.urgency,
      peopleAffected: helpRequest.peopleAffected,
      description: helpRequest.description,
      phone: helpRequest.phone,
      images: helpRequest.images,
      needs: helpRequest.needs,
      source: 'admin-approved',
      helpRequestId: helpRequest._id,
      status: 'active'
    });

    await activeDisaster.save();

    // Update help request
    helpRequest.disasterApprovalStatus = 'approved';
    helpRequest.approvedDisasterId = activeDisaster._id;
    await helpRequest.save();

    res.status(200).json({
      success: true,
      message: 'Help request approved as Active Disaster',
      data: {
        helpRequest,
        activeDisaster
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve disaster',
      error: error.message
    });
  }
};

// REJECT help request as disaster (keep as help request only)
const rejectAsActiveDisaster = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { disasterApprovalStatus: 'rejected' },
      { new: true }
    );

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Help request will not be added to active disasters',
      data: helpRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject approval',
      error: error.message
    });
  }
};

const getPendingApprovals = async (req, res) => {
  try {
    const pendingRequests = await HelpRequest.find({ 
      disasterApprovalStatus: 'pending' 
    })
    .select('-images')
    .sort({ urgency: 1, createdAt: -1 })
    .lean();

    res.status(200).json({
      success: true,
      count: pendingRequests.length,
      data: pendingRequests
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals',
      error: error.message
    });
  }
};

module.exports = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest,
  approveAsActiveDisaster,
  rejectAsActiveDisaster,
  getPendingApprovals
};
