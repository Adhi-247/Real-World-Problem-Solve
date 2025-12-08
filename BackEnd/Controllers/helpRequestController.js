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

// Get all help requests
const getAllHelpRequests = async (req, res) => {
  try {
    const helpRequests = await HelpRequest.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: helpRequests.length,
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
    
    if (!['pending', 'in-progress', 'resolved'].includes(status)) {
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

module.exports = {
  createHelpRequest,
  getAllHelpRequests,
  getHelpRequestById,
  updateHelpRequestStatus
};
