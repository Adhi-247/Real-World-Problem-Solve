import React, { useState, useEffect } from 'react';
import './MissingPersonManagement.css';

const MissingPersonManagement = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    fetchMissingPersons();
  }, []);

  const fetchMissingPersons = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/missing-persons');
      const data = await response.json();

      if (data.success) {
        setMissingPersons(data.data);
      } else {
        setError('Failed to fetch missing persons');
      }
    } catch (error) {
      console.error('Error fetching missing persons:', error);
      setError('Failed to fetch missing persons');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (person) => {
    setSelectedPerson(person);
    setShowModal(true);
  };

  const handleStatusUpdate = async (personId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/missing-persons/${personId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert('Status updated successfully');
        fetchMissingPersons();
        if (selectedPerson && selectedPerson._id === personId) {
          setSelectedPerson({ ...selectedPerson, status: newStatus });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (personId) => {
    if (!window.confirm('Are you sure you want to delete this missing person report?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/missing-persons/${personId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Missing person report deleted successfully');
        fetchMissingPersons();
        setShowModal(false);
      } else {
        alert('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'missing':
        return '#dc3545';
      case 'investigating':
        return '#ffc107';
      case 'found':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const calculateDaysMissing = (lastSeenDate) => {
    const today = new Date();
    const lastSeen = new Date(lastSeenDate);
    const diffTime = Math.abs(today - lastSeen);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredPersons = missingPersons.filter(person => {
    const statusMatch = filterStatus === 'all' || person.status === filterStatus;
    const genderMatch = filterGender === 'all' || person.gender === filterGender;
    return statusMatch && genderMatch;
  });

  if (loading) {
    return <div className="loading">Loading missing persons...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="missing-person-management">
      <div className="management-header">
        <h2>🔍 Missing Persons Management</h2>
        <button className="refresh-btn" onClick={fetchMissingPersons}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="missing">Missing</option>
            <option value="investigating">Investigating</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Gender Filter:</label>
          <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
            <option value="all">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{missingPersons.length}</h3>
          <p>Total Reports</p>
        </div>
        <div className="stat-card missing">
          <h3>{missingPersons.filter(p => p.status === 'missing').length}</h3>
          <p>Still Missing</p>
        </div>
        <div className="stat-card investigating">
          <h3>{missingPersons.filter(p => p.status === 'investigating').length}</h3>
          <p>Investigating</p>
        </div>
        <div className="stat-card found">
          <h3>{missingPersons.filter(p => p.status === 'found').length}</h3>
          <p>Found</p>
        </div>
      </div>

      {/* Missing Persons Table */}
      <div className="table-container">
        <table className="persons-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Missing Person</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Last Seen Location</th>
              <th>District</th>
              <th>Last Seen Date</th>
              <th>Days Missing</th>
              <th>Reporter</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPersons.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">No missing person reports found</td>
              </tr>
            ) : (
              filteredPersons.map((person, index) => (
                <tr key={person._id}>
                  <td>{index + 1}</td>
                  <td>
                    {person.photo ? (
                      <img src={person.photo} alt={person.missingPersonName} className="table-photo" />
                    ) : (
                      <div className="no-photo">No Photo</div>
                    )}
                  </td>
                  <td><strong>{person.missingPersonName}</strong></td>
                  <td>{person.age}</td>
                  <td>{person.gender}</td>
                  <td>{person.lastSeenLocation}</td>
                  <td>{person.district}</td>
                  <td>{new Date(person.lastSeenDate).toLocaleDateString()}</td>
                  <td>
                    <span className="days-badge">
                      {calculateDaysMissing(person.lastSeenDate)} days
                    </span>
                  </td>
                  <td>{person.reporterName}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(person.status) }}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-btn view-btn" 
                      onClick={() => handleViewDetails(person)}
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing details */}
      {showModal && selectedPerson && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Missing Person Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Photo Section */}
              {selectedPerson.photo && (
                <div className="detail-section photo-section">
                  <img 
                    src={selectedPerson.photo} 
                    alt={selectedPerson.missingPersonName} 
                    className="person-photo"
                  />
                </div>
              )}

              <div className="detail-section">
                <h3>Missing Person Information</h3>
                <p><strong>Name:</strong> {selectedPerson.missingPersonName}</p>
                <p><strong>Age:</strong> {selectedPerson.age} years old</p>
                <p><strong>Gender:</strong> {selectedPerson.gender}</p>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(selectedPerson.status) }}
                  >
                    {selectedPerson.status}
                  </span>
                </p>
                <p><strong>Days Missing:</strong> {calculateDaysMissing(selectedPerson.lastSeenDate)} days</p>
              </div>

              <div className="detail-section">
                <h3>Last Seen Information</h3>
                <p><strong>Location:</strong> {selectedPerson.lastSeenLocation}</p>
                <p><strong>District:</strong> {selectedPerson.district}</p>
                <p><strong>Date:</strong> {new Date(selectedPerson.lastSeenDate).toLocaleDateString()}</p>
                {selectedPerson.lastSeenTime && (
                  <p><strong>Time:</strong> {selectedPerson.lastSeenTime}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>Physical Description</h3>
                {selectedPerson.height && <p><strong>Height:</strong> {selectedPerson.height} cm</p>}
                {selectedPerson.weight && <p><strong>Weight:</strong> {selectedPerson.weight} kg</p>}
                {selectedPerson.clothingDescription && (
                  <p><strong>Clothing:</strong> {selectedPerson.clothingDescription}</p>
                )}
                {selectedPerson.identifyingFeatures && (
                  <p><strong>Identifying Features:</strong> {selectedPerson.identifyingFeatures}</p>
                )}
              </div>

              {selectedPerson.additionalInfo && (
                <div className="detail-section">
                  <h3>Additional Information</h3>
                  <p>{selectedPerson.additionalInfo}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Reporter Information</h3>
                <p><strong>Name:</strong> {selectedPerson.reporterName}</p>
                <p><strong>Phone:</strong> {selectedPerson.reporterPhone}</p>
                <p><strong>Reported On:</strong> {new Date(selectedPerson.createdAt).toLocaleString()}</p>
              </div>

              <div className="detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button 
                    className="status-update-btn missing-btn"
                    onClick={() => handleStatusUpdate(selectedPerson._id, 'missing')}
                  >
                    Set Missing
                  </button>
                  <button 
                    className="status-update-btn investigating-btn"
                    onClick={() => handleStatusUpdate(selectedPerson._id, 'investigating')}
                  >
                    Set Investigating
                  </button>
                  <button 
                    className="status-update-btn found-btn"
                    onClick={() => handleStatusUpdate(selectedPerson._id, 'found')}
                  >
                    Set Found
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(selectedPerson._id)}
                >
                  🗑️ Delete Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissingPersonManagement;
