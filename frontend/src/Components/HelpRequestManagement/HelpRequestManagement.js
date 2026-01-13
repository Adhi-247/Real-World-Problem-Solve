import React, { useState, useEffect } from 'react';
import './HelpRequestManagement.css';

const HelpRequestManagement = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  useEffect(() => {
    fetchHelpRequests();
  }, []);

  const fetchHelpRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/help-requests');
      const data = await response.json();

      if (data.success) {
        setHelpRequests(data.data);
      } else {
        setError('Failed to fetch help requests');
      }
    } catch (error) {
      console.error('Error fetching help requests:', error);
      setError('Failed to fetch help requests');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/help-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        alert('Status updated successfully');
        fetchHelpRequests();
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this help request?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/help-requests/${requestId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        alert('Help request deleted successfully');
        fetchHelpRequests();
        setShowModal(false);
      } else {
        alert('Failed to delete help request');
      }
    } catch (error) {
      console.error('Error deleting help request:', error);
      alert('Failed to delete help request');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'in-progress':
        return '#17a2b8';
      case 'completed':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const filteredRequests = helpRequests.filter(request => {
    const statusMatch = filterStatus === 'all' || request.status === filterStatus;
    const urgencyMatch = filterUrgency === 'all' || request.urgency === filterUrgency;
    return statusMatch && urgencyMatch;
  });

  if (loading) {
    return <div className="loading">Loading help requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="help-request-management">
      <div className="management-header">
        <h2>📋 Help Requests Management</h2>
        <button className="refresh-btn" onClick={fetchHelpRequests}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Urgency Filter:</label>
          <select value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)}>
            <option value="all">All Urgency</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{helpRequests.length}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-card pending">
          <h3>{helpRequests.filter(r => r.status === 'pending').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card in-progress">
          <h3>{helpRequests.filter(r => r.status === 'in-progress').length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card completed">
          <h3>{helpRequests.filter(r => r.status === 'completed').length}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Disaster Type</th>
              <th>Location</th>
              <th>District</th>
              <th>Urgency</th>
              <th>People Affected</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="11" className="no-data">No help requests found</td>
              </tr>
            ) : (
              filteredRequests.map((request, index) => (
                <tr key={request._id}>
                  <td>{index + 1}</td>
                  <td>{request.name}</td>
                  <td>{request.phone}</td>
                  <td>{request.disasterType}</td>
                  <td>{request.location}</td>
                  <td>{request.district}</td>
                  <td>
                    <span 
                      className="urgency-badge" 
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency}
                    </span>
                  </td>
                  <td>{request.peopleAffected}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="action-btn view-btn" 
                      onClick={() => handleViewDetails(request)}
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
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Help Request Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> {selectedRequest.name}</p>
                <p><strong>Phone:</strong> {selectedRequest.phone}</p>
              </div>

              <div className="detail-section">
                <h3>Disaster Information</h3>
                <p><strong>Disaster Type:</strong> {selectedRequest.disasterType}</p>
                <p><strong>Location:</strong> {selectedRequest.location}</p>
                <p><strong>District:</strong> {selectedRequest.district}</p>
                <p><strong>Address:</strong> {selectedRequest.address}</p>
              </div>

              <div className="detail-section">
                <h3>Request Details</h3>
                <p><strong>Urgency:</strong> 
                  <span 
                    className="urgency-badge" 
                    style={{ backgroundColor: getUrgencyColor(selectedRequest.urgency) }}
                  >
                    {selectedRequest.urgency}
                  </span>
                </p>
                <p><strong>People Affected:</strong> {selectedRequest.peopleAffected}</p>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                  >
                    {selectedRequest.status}
                  </span>
                </p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
              </div>

              <div className="detail-section">
                <h3>Needs</h3>
                <div className="needs-list">
                  {selectedRequest.needs?.food && <span className="need-badge">🍚 Food</span>}
                  {selectedRequest.needs?.water && <span className="need-badge">💧 Water</span>}
                  {selectedRequest.needs?.medicine && <span className="need-badge">💊 Medicine</span>}
                  {selectedRequest.needs?.shelter && <span className="need-badge">🏠 Shelter</span>}
                  {selectedRequest.needs?.clothing && <span className="need-badge">👕 Clothing</span>}
                  {selectedRequest.needs?.blankets && <span className="need-badge">🛏️ Blankets</span>}
                  {selectedRequest.needs?.firstAid && <span className="need-badge">🏥 First Aid</span>}
                  {selectedRequest.needs?.rescue && <span className="need-badge">🚁 Rescue</span>}
                  {selectedRequest.needs?.other && (
                    <span className="need-badge">📝 Other: {selectedRequest.needs.other}</span>
                  )}
                </div>
              </div>

              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="detail-section">
                  <h3>Images</h3>
                  <div className="images-grid">
                    {selectedRequest.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Request ${index + 1}`} 
                        className="request-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button 
                    className="status-update-btn pending-btn"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'pending')}
                  >
                    Set Pending
                  </button>
                  <button 
                    className="status-update-btn progress-btn"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'in-progress')}
                  >
                    Set In Progress
                  </button>
                  <button 
                    className="status-update-btn completed-btn"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'completed')}
                  >
                    Set Completed
                  </button>
                  <button 
                    className="status-update-btn rejected-btn"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
                  >
                    Set Rejected
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(selectedRequest._id)}
                >
                  🗑️ Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpRequestManagement;
