import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AdminManagement.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    adminId: '',
    department: ''
  });

  // Fetch all admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = admins.filter(admin =>
      admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.adminId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admins');
      if (response.data.success) {
        setAdmins(response.data.data);
        setFilteredAdmins(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAdmin = () => {
    setModalMode('add');
    setFormData({
      username: '',
      email: '',
      password: '',
      adminId: '',
      department: ''
    });
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setModalMode('edit');
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      adminId: admin.adminId,
      department: admin.department
    });
    setShowModal(true);
  };

  const handleViewAdmin = (admin) => {
    setModalMode('view');
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        const response = await axios.post('http://localhost:5000/api/admins/register', formData);
        if (response.data.success) {
          alert('Admin added successfully!');
          fetchAdmins();
          setShowModal(false);
        }
      } else if (modalMode === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        const response = await axios.put(
          `http://localhost:5000/api/admins/${selectedAdmin._id}`,
          updateData
        );
        if (response.data.success) {
          alert('Admin updated successfully!');
          fetchAdmins();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving admin:', error);
      alert(error.response?.data?.message || 'Failed to save admin');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/admins/${id}`);
        if (response.data.success) {
          alert('Admin deleted successfully!');
          fetchAdmins();
        }
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin');
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('Admin Management Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add total count
    doc.text(`Total Admins: ${filteredAdmins.length}`, 14, 37);

    // Prepare table data
    const tableData = filteredAdmins.map((admin, index) => [
      index + 1,
      admin.username,
      admin.email,
      admin.adminId,
      admin.department,
      new Date(admin.createdAt).toLocaleDateString()
    ]);

    // Add table
    doc.autoTable({
      startY: 45,
      head: [['#', 'Username', 'Email', 'Admin ID', 'Department', 'Joined Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    // Save PDF
    doc.save(`admin-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="management-container">
      {/* Count Bar */}
      <div className="count-bar">
        <div className="count-card">
          <div className="count-icon">👨‍💼</div>
          <div className="count-details">
            <h3>{admins.length}</h3>
            <p>Total Admins</p>
          </div>
        </div>
        <div className="count-card">
          <div className="count-icon">🔍</div>
          <div className="count-details">
            <h3>{filteredAdmins.length}</h3>
            <p>Filtered Results</p>
          </div>
        </div>
        <div className="count-card">
          <div className="count-icon">📅</div>
          <div className="count-details">
            <h3>{new Date().toLocaleDateString()}</h3>
            <p>Today's Date</p>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by username, email, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button className="btn-add" onClick={handleAddAdmin}>
            ➕ Add Admin
          </button>
          <button className="btn-download" onClick={downloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading admins...</div>
        ) : filteredAdmins.length === 0 ? (
          <div className="no-data">No admins found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin ID</th>
                <th>Department</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <tr key={admin._id}>
                  <td>{index + 1}</td>
                  <td>{admin.username}</td>
                  <td>{admin.email}</td>
                  <td>{admin.adminId}</td>
                  <td>{admin.department}</td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button
                      className="btn-view"
                      onClick={() => handleViewAdmin(admin)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditAdmin(admin)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteAdmin(admin._id)}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === 'add' && '➕ Add New Admin'}
                {modalMode === 'edit' && '✏️ Edit Admin'}
                {modalMode === 'view' && '👁️ View Admin Details'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="view-details">
                <div className="detail-row">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{selectedAdmin?.username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedAdmin?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Admin ID:</span>
                  <span className="detail-value">{selectedAdmin?.adminId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedAdmin?.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joined Date:</span>
                  <span className="detail-value">
                    {new Date(selectedAdmin?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email"
                  />
                </div>
                {modalMode === 'add' && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter password"
                    />
                  </div>
                )}
                {modalMode === 'edit' && (
                  <div className="form-group">
                    <label>Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Admin ID *</label>
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter admin ID"
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter department"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {modalMode === 'add' ? 'Add Admin' : 'Update Admin'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
