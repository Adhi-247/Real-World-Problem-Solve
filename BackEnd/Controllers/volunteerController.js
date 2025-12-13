const Volunteer = require('../Models/volunteerModel');

// Submit Volunteer Application
exports.submitVolunteerApplication = async (req, res) => {
  try {
    const volunteerData = {
      ...req.body,
      userId: req.body.userId || req.user?.id
    };

    const volunteer = await Volunteer.create(volunteerData);

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Volunteer By ID
exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('userId', 'username email');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Volunteers by User ID
exports.getVolunteersByUserId = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Volunteer
exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer updated successfully',
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Volunteer Status (Approve/Reject)
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Volunteer application ${status.toLowerCase()}`,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
