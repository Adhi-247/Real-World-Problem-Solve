import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './VolunteerManagement.css';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'approve', 'reject'
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  useEffect(() => {
    let filtered = volunteers.filter(volunteer =>
      volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone?.includes(searchTerm) ||
      volunteer.skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'All') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }

    setFilteredVolunteers(filtered);
  }, [searchTerm, volunteers, filterStatus]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/volunteers');
      if (response.data.success) {
        setVolunteers(response.data.data);
        setFilteredVolunteers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      alert('Failed to fetch volunteers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVolunteer = (volunteer) => {
    setModalMode('view');
    setSelectedVolunteer(volunteer);
    setAdminNotes(volunteer.adminNotes || '');
    setShowModal(true);
  };

  const handleApproveReject = (volunteer, action) => {
    setModalMode(action);
    setSelectedVolunteer(volunteer);
    setAdminNotes(volunteer.adminNotes || '');
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const status = modalMode === 'approve' ? 'Approved' : 'Rejected';
      const response = await axios.put(
        `http://localhost:5000/api/volunteers/${selectedVolunteer._id}/status`,
        { status, adminNotes }
      );

      if (response.data.success) {
        alert(`Volunteer application ${status.toLowerCase()} successfully!`);
        fetchVolunteers();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer application?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/volunteers/${id}`);
        if (response.data.success) {
          alert('Volunteer deleted successfully!');
          fetchVolunteers();
        }
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        alert('Failed to delete volunteer');
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Volunteer Management Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Volunteers: ${filteredVolunteers.length}`, 14, 37);

    const tableData = filteredVolunteers.map((vol, index) => [
      index + 1,
      vol.fullName,
      vol.email,
      vol.phone,
      vol.skills.substring(0, 30) + '...',
      vol.availability,
      vol.status,
      new Date(vol.createdAt).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 45,
      head: [['#', 'Name', 'Email', 'Phone', 'Skills', 'Availability', 'Status', 'Applied Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [102, 126, 234] },
      styles: { fontSize: 8 }
    });

    doc.save(`volunteer-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStatusCounts = () => {
    return {
      total: volunteers.length,
      pending: volunteers.filter(v => v.status === 'Pending').length,
      approved: volunteers.filter(v => v.status === 'Approved').length,
      rejected: volunteers.filter(v => v.status === 'Rejected').length
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="management-container">
      {/* Count Bar */}
      <div className="count-bar">
        <div className="count-card volunteer-card-total">
          <div className="count-icon">🤝</div>
          <div className="count-details">
            <h3>{counts.total}</h3>
            <p>Total Volunteers</p>
          </div>
        </div>
        <div className="count-card volunteer-card-pending">
          <div className="count-icon">⏳</div>
          <div className="count-details">
            <h3>{counts.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="count-card volunteer-card-approved">
          <div className="count-icon">✅</div>
          <div className="count-details">
            <h3>{counts.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="count-card volunteer-card-rejected">
          <div className="count-icon">❌</div>
          <div className="count-details">
            <h3>{counts.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by name, email, phone, skills, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="btn-download" onClick={downloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading volunteers...</div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="no-data">No volunteers found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer, index) => (
                <tr key={volunteer._id}>
                  <td>{index + 1}</td>
                  <td>{volunteer.fullName}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.phone}</td>
                  <td>{volunteer.skills.substring(0, 30)}...</td>
                  <td>{volunteer.availability}</td>
                  <td>
                    <span className={`status-badge status-${volunteer.status.toLowerCase()}`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td>{new Date(volunteer.createdAt).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button
                      className="btn-view"
                      onClick={() => handleViewVolunteer(volunteer)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    {volunteer.status === 'Pending' && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApproveReject(volunteer, 'approve')}
                          title="Approve"
                        >
                          ✓
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleApproveReject(volunteer, 'reject')}
                          title="Reject"
                        >
                          ✗
                        </button>
                      </>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteVolunteer(volunteer._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content volunteer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'view' && '👁️ Volunteer Details'}
                {modalMode === 'approve' && '✅ Approve Volunteer'}
                {modalMode === 'reject' && '❌ Reject Volunteer'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name:</span>
                  <span className="detail-value">{selectedVolunteer?.fullName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedVolunteer?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedVolunteer?.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">
                    {new Date(selectedVolunteer?.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedVolunteer?.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Occupation:</span>
                  <span className="detail-value">{selectedVolunteer?.occupation}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience:</span>
                  <span className="detail-value">{selectedVolunteer?.experienceYears} years</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Skills:</span>
                  <span className="detail-value">{selectedVolunteer?.skills}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Availability:</span>
                  <span className="detail-value">{selectedVolunteer?.availability}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge status-${selectedVolunteer?.status.toLowerCase()}`}>
                    {selectedVolunteer?.status}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Previous Experience:</span>
                  <span className="detail-value">
                    {selectedVolunteer?.previousExperience || 'None'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Emergency Contact:</span>
                  <span className="detail-value">{selectedVolunteer?.emergencyContactName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Emergency Phone:</span>
                  <span className="detail-value">{selectedVolunteer?.emergencyContactPhone}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Reason to Volunteer:</span>
                  <span className="detail-value">{selectedVolunteer?.reasonToVolunteer}</span>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="admin-notes-section">
                  <label>Admin Notes:</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this decision..."
                    rows="4"
                  />
                </div>
              )}
            </div>

            {modalMode !== 'view' && (
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button 
                  className={modalMode === 'approve' ? 'btn-confirm-approve' : 'btn-confirm-reject'}
                  onClick={handleStatusUpdate}
                >
                  {modalMode === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;
