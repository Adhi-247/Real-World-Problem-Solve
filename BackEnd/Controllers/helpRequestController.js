const HelpRequest = require('../Models/helpRequestModel');

// Create new help request
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
      images: images || []
    });

    // Save to database
    await helpRequest.save();

    res.status(201).json({
      success: true,
      message: 'Help request submitted successfully',
      data: helpRequest
    });

  } catch (error) {
    console.error('Error creating help request:', error);
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
    console.log('📥 Fetching help requests...', new Date().toISOString());
    const startTime = Date.now();
    
    const { page = 1, limit = 20, status, urgency, disasterType, includeImages = 'false' } = req.query;
    
    // Build query filter
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (disasterType) filter.disasterType = disasterType;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build projection - exclude images by default to reduce payload size
    const projection = includeImages === 'true' ? {} : { images: 0 };
    
    // Execute query with pagination
    const [helpRequests, total] = await Promise.all([
      HelpRequest.find(filter, projection)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(), // Use lean() for faster queries
      HelpRequest.countDocuments(filter)
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Query completed in ${duration}ms - Found ${helpRequests.length} records`);
    
    res.status(200).json({
      success: true,
      count: helpRequests.length,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: helpRequests
    });

  } catch (error) {
    console.error('Error fetching help requests:', error);
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
    console.error('Error fetching help request:', error);
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
    console.error('Error updating help request:', error);
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
    console.error('Error deleting help request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete help request',
      error: error.message
    });
  }
};

module.exports = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus,
  deleteHelpRequest
};
