import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users');
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
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

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      phone: user.phone,
      address: user.address
    });
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setModalMode('view');
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        const response = await axios.post('http://localhost:5000/api/users/register', formData);
        if (response.data.success) {
          alert('User added successfully!');
          fetchUsers();
          setShowModal(false);
        }
      } else if (modalMode === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        const response = await axios.put(
          `http://localhost:5000/api/users/${selectedUser._id}`,
          updateData
        );
        if (response.data.success) {
          alert('User updated successfully!');
          fetchUsers();
          setShowModal(false);
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/users/${id}`);
        if (response.data.success) {
          alert('User deleted successfully!');
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('User Management Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add total count
    doc.text(`Total Users: ${filteredUsers.length}`, 14, 37);

    // Prepare table data
    const tableData = filteredUsers.map((user, index) => [
      index + 1,
      user.username,
      user.email,
      user.phone,
      user.address,
      new Date(user.createdAt).toLocaleDateString()
    ]);

    // Add table
    doc.autoTable({
      startY: 45,
      head: [['#', 'Username', 'Email', 'Phone', 'Address', 'Joined Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 9 }
    });

    // Save PDF
    doc.save(`user-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="management-container">
      {/* Count Bar */}
      <div className="count-bar">
        <div className="count-card user-card-1">
          <div className="count-icon">👥</div>
          <div className="count-details">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="count-card user-card-2">
          <div className="count-icon">🔍</div>
          <div className="count-details">
            <h3>{filteredUsers.length}</h3>
            <p>Filtered Results</p>
          </div>
        </div>
        <div className="count-card user-card-3">
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
            placeholder="🔍 Search by username, email, phone, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button className="btn-add" onClick={handleAddUser}>
            ➕ Add User
          </button>
          <button className="btn-download" onClick={downloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-data">No users found</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button
                      className="btn-view"
                      onClick={() => handleViewUser(user)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user._id)}
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
                {modalMode === 'add' && '➕ Add New User'}
                {modalMode === 'edit' && '✏️ Edit User'}
                {modalMode === 'view' && '👁️ View User Details'}
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {modalMode === 'view' ? (
              <div className="view-details">
                <div className="detail-row">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{selectedUser?.username}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedUser?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{selectedUser?.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedUser?.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Joined Date:</span>
                  <span className="detail-value">
                    {new Date(selectedUser?.createdAt).toLocaleDateString()}
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
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter address"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    {modalMode === 'add' ? 'Add User' : 'Update User'}
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

export default UserManagement;
