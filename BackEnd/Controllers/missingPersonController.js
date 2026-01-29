const MissingPerson = require('../Models/missingPersonModel');

// Report new missing person
const reportMissingPerson = async (req, res) => {
  try {
    const {
      reporterName,
      reporterPhone,
      missingPersonName,
      age,
      gender,
      lastSeenLocation,
      district,
      lastSeenDate,
      lastSeenTime,
      height,
      weight,
      clothingDescription,
      identifyingFeatures,
      additionalInfo,
      photo
    } = req.body;

    // Validate required fields
    if (!reporterName || !reporterPhone || !missingPersonName || !age || !gender || !lastSeenLocation || !district || !lastSeenDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new missing person report
    const missingPerson = new MissingPerson({
      reporterName,
      reporterPhone,
      missingPersonName,
      age,
      gender,
      lastSeenLocation,
      district,
      lastSeenDate,
      lastSeenTime,
      height,
      weight,
      clothingDescription,
      identifyingFeatures,
      additionalInfo,
      photo
    });

    // Save to database
    await missingPerson.save();

    res.status(201).json({
      success: true,
      message: 'Missing person report submitted successfully',
      data: missingPerson
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit missing person report',
      error: error.message
    });
  }
};

// Search missing persons
const searchMissingPersons = async (req, res) => {
  try {
    const { name, district, ageRange, gender, lastSeenDate } = req.query;
    
    let query = { status: 'missing' };

    // Build search query
    if (name) {
      query.missingPersonName = { $regex: name, $options: 'i' };
    }
    
    if (district) {
      query.district = district;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    if (ageRange) {
      switch(ageRange) {
        case 'child':
          query.age = { $gte: 0, $lte: 12 };
          break;
        case 'teen':
          query.age = { $gte: 13, $lte: 17 };
          break;
        case 'adult':
          query.age = { $gte: 18, $lte: 60 };
          break;
        case 'senior':
          query.age = { $gte: 60 };
          break;
      }
    }
    
    if (lastSeenDate) {
      const date = new Date(lastSeenDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      query.lastSeenDate = { $gte: date, $lt: nextDay };
    }

    const missingPersons = await MissingPerson.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: missingPersons.length,
      data: missingPersons
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search missing persons',
      error: error.message
    });
  }
};

// Get all missing persons
const getAllMissingPersons = async (req, res) => {
  try {
    const missingPersons = await MissingPerson.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: missingPersons.length,
      data: missingPersons
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch missing persons',
      error: error.message
    });
  }
};

// Get missing person by ID
const getMissingPersonById = async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findById(req.params.id);
    
    if (!missingPerson) {
      return res.status(404).json({
        success: false,
        message: 'Missing person not found'
      });
    }

    res.status(200).json({
      success: true,
      data: missingPerson
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch missing person',
      error: error.message
    });
  }
};

// Update missing person status
const updateMissingPersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['missing', 'found', 'investigating'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const missingPerson = await MissingPerson.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!missingPerson) {
      return res.status(404).json({
        success: false,
        message: 'Missing person not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: missingPerson
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update missing person',
      error: error.message
    });
  }
};

// Delete missing person report
const deleteMissingPerson = async (req, res) => {
  try {
    const missingPerson = await MissingPerson.findByIdAndDelete(req.params.id);

    if (!missingPerson) {
      return res.status(404).json({
        success: false,
        message: 'Missing person not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Missing person report deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete missing person',
      error: error.message
    });
  }
};

module.exports = {
  reportMissingPerson,
  searchMissingPersons,
  getAllMissingPersons,
  getMissingPersonById,
  updateMissingPersonStatus,
  deleteMissingPerson
};
