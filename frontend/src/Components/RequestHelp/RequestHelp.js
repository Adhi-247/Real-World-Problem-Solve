import React, { useState } from 'react';
import './RequestHelp.css';

const RequestHelp = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    disasterType: '',
    location: '',
    district: '',
    address: '',
    description: '',
    urgency: 'medium',
    peopleAffected: '',
    images: [],
    needs: {
      food: false,
      water: false,
      medicine: false,
      shelter: false,
      clothing: false,
      blankets: false,
      firstAid: false,
      rescue: false,
      other: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNeedsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      needs: {
        ...formData.needs,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      alert('You can only upload up to 5 images');
      return;
    }

    // Check each file size (limit to 2MB each)
    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Each image must be less than 2MB. Please choose smaller images.');
        e.target.value = '';
        return;
      }
    }

    // Create preview URLs for the images
    const newImages = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  // Convert image to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert images to Base64
      const base64Images = await Promise.all(
        formData.images.map(img => convertToBase64(img.file))
      );

      const requestData = {
        name: formData.name,
        phone: formData.phone,
        disasterType: formData.disasterType,
        location: formData.location,
        district: formData.district,
        address: formData.address,
        urgency: formData.urgency,
        peopleAffected: parseInt(formData.peopleAffected),
        needs: formData.needs,
        description: formData.description,
        images: base64Images
      };

      const response = await fetch('http://localhost:5000/api/help-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Help request submitted successfully! We will contact you soon.');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          disasterType: '',
          location: '',
          district: '',
          address: '',
          description: '',
          urgency: 'medium',
          peopleAffected: '',
          images: [],
          needs: {
            food: false,
            water: false,
            medicine: false,
            shelter: false,
            clothing: false,
            blankets: false,
            firstAid: false,
            rescue: false,
            other: ''
          }
        });
      } else {
        alert('Failed to submit request: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit help request. Please try again.');
    }
  };

  return (
    <div className="request-help-page">
      <div className="request-help-header">
        <h1>🆘 Request Help</h1>
        <p>Fill out this form and we'll assist you as soon as possible</p>
      </div>

      <div className="request-help-container">
        <form className="help-request-form" onSubmit={handleSubmit}>
          
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="07X XXX XXXX"
                required 
              />
            </div>
          </div>

          {/* Disaster Information */}
          <div className="form-section">
            <h3>Disaster Information</h3>
            
            <div className="form-group">
              <label>Type of Disaster *</label>
              <select 
                name="disasterType" 
                value={formData.disasterType}
                onChange={handleChange}
                required
              >
                <option value="">Select disaster type</option>
                <option value="tsunami">Tsunami</option>
                <option value="floods">Floods</option>
                <option value="wildfire">Wildfire</option>
                <option value="landslide">Landslide</option>
                <option value="cyclone">Cyclone</option>
              </select>
            </div>

            <div className="form-group">
              <label>Urgency Level *</label>
              <select 
                name="urgency" 
                value={formData.urgency}
                onChange={handleChange}
                required
              >
                <option value="low">Low - Can wait</option>
                <option value="medium">Medium - Need help soon</option>
                <option value="high">High - Urgent</option>
                <option value="critical">Critical - Life threatening</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h3>Location Details</h3>
            
            <div className="form-group">
              <label>District *</label>
              <select 
                name="district" 
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select your district</option>
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
                <option value="Kandy">Kandy</option>
                <option value="Matale">Matale</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Galle">Galle</option>
                <option value="Matara">Matara</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Kilinochchi">Kilinochchi</option>
                <option value="Mannar">Mannar</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullaitivu">Mullaitivu</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Badulla">Badulla</option>
                <option value="Moneragala">Moneragala</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Kegalle">Kegalle</option>
              </select>
            </div>

            <div className="form-group">
              <label>City/Town *</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your city or town"
                required 
              />
            </div>

            <div className="form-group">
              <label>Full Address *</label>
              <textarea 
                name="address" 
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="2"
                required 
              />
            </div>
          </div>

          {/* Needs/Resources Required */}
          <div className="form-section">
            <h3>What Do You Need? *</h3>
            <p className="section-description">Select all items you need assistance with</p>
            
            <div className="needs-grid">
              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="food"
                  checked={formData.needs.food}
                  onChange={handleNeedsChange}
                />
                <span>🍚 Food & Water</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="water"
                  checked={formData.needs.water}
                  onChange={handleNeedsChange}
                />
                <span>💧 Drinking Water</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="medicine"
                  checked={formData.needs.medicine}
                  onChange={handleNeedsChange}
                />
                <span>💊 Medicine</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="shelter"
                  checked={formData.needs.shelter}
                  onChange={handleNeedsChange}
                />
                <span>🏠 Temporary Shelter</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="clothing"
                  checked={formData.needs.clothing}
                  onChange={handleNeedsChange}
                />
                <span>👕 Clothing</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="blankets"
                  checked={formData.needs.blankets}
                  onChange={handleNeedsChange}
                />
                <span>🛏️ Blankets/Bedding</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="firstAid"
                  checked={formData.needs.firstAid}
                  onChange={handleNeedsChange}
                />
                <span>🩹 First Aid Kit</span>
              </label>

              <label className="checkbox-item">
                <input 
                  type="checkbox" 
                  name="rescue"
                  checked={formData.needs.rescue}
                  onChange={handleNeedsChange}
                />
                <span>🚁 Emergency Rescue</span>
              </label>
            </div>

            <div className="form-group">
              <label>Other Specific Needs</label>
              <textarea 
                name="other" 
                value={formData.needs.other}
                onChange={handleNeedsChange}
                placeholder="List any other specific items you need (e.g., baby formula, diabetic medication, etc.)"
                rows="3"
              />
            </div>
          </div>

          {/* Situation Details */}
          <div className="form-section">
            <h3>Current Situation</h3>
            
            <div className="form-group">
              <label>Number of People Affected</label>
              <input 
                type="number" 
                name="peopleAffected" 
                value={formData.peopleAffected}
                onChange={handleChange}
                placeholder="How many people need help?"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Describe Your Situation *</label>
              <textarea 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe what happened and what kind of help you need..."
                rows="5"
                required 
              />
            </div>

            <div className="form-group">
              <label>Upload Photos (Optional - Max 5 photos)</label>
              <input 
                type="file" 
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input"
                disabled={formData.images.length >= 5}
              />
              <small>Upload photos of the current situation ({formData.images.length}/5)</small>
              
              {/* Image Preview Section */}
              {formData.images.length > 0 && (
                <div className="image-preview-container">
                  {formData.images.map((img, index) => (
                    <div key={index} className="image-preview-box">
                      <img src={img.preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Help Request
          </button>
        </form>

        {/* Info Sidebar */}
        <div className="help-info-sidebar">
          <div className="info-card">
            <h3>🚨 Emergency Numbers</h3>
            <ul>
              <li><strong>Police:</strong> 119</li>
              <li><strong>Ambulance:</strong> 1990</li>
              <li><strong>Fire:</strong> 110</li>
              <li><strong>Disaster Mgmt:</strong> 117</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>ℹ️ What to Expect</h3>
            <ul>
              <li>Your request will be reviewed immediately</li>
              <li>We'll contact you within 1-2 hours</li>
              <li>Help will be dispatched based on urgency</li>
              <li>Keep your phone accessible</li>
            </ul>
          </div>

          <div className="info-card tips">
            <h3>💡 Tips</h3>
            <ul>
              <li>Provide accurate information</li>
              <li>Include clear photos if possible</li>
              <li>Mention any medical emergencies</li>
              <li>Stay calm and safe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHelp;
