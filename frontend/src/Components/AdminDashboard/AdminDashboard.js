import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminManagement from '../AdminManagement/AdminManagement';
import UserManagement from '../UserManagement/UserManagement';
import VolunteerManagement from '../VolunteerManagement/VolunteerManagement';
import HelpRequestManagement from '../HelpRequestManagement/HelpRequestManagement';
import MissingPersonManagement from '../MissingPersonManagement/MissingPersonManagement';
import ActiveDisasterManagement from '../ActiveDisasterManagement/ActiveDisasterManagement';
import DashboardStatistics from '../DashboardStatistics/DashboardStatistics';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Left Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>🔐 Admin Panel</h2>
          <p>Disaster Management System</p>
        </div>

        <nav className="admin-nav">
          <button 
            className={activeSection === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard Statistics
          </button>

          <button 
            className={activeSection === 'admins' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('admins')}
          >
            👨‍💼 Admin Management
          </button>

          <button 
            className={activeSection === 'users' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('users')}
          >
            👥 User Management
          </button>

          <button 
            className={activeSection === 'volunteers' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('volunteers')}
          >
            🤝 Volunteer Management
          </button>

          <button 
            className={activeSection === 'disasters' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('disasters')}
          >
            🌊 Active Disasters Management
          </button>

          <button 
            className={activeSection === 'help-requests' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('help-requests')}
          >
            📋 Help Requests Management
          </button>

          <button 
            className={activeSection === 'missing-persons' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveSection('missing-persons')}
          >
            🔍 Missing Persons Management
          </button>
        </nav>

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <div className="content-header">
          <h1>
            {activeSection === 'dashboard' && '📊 Dashboard Statistics'}
            {activeSection === 'help-requests' && '📋 Help Requests Management'}
            {activeSection === 'missing-persons' && '🔍 Missing Persons Management'}
            {activeSection === 'users' && '👥 User Management'}
            {activeSection === 'volunteers' && '🤝 Volunteer Management'}
            {activeSection === 'disasters' && '🌊 Active Disasters Management'}
            {activeSection === 'admins' && '👨‍💼 Admin Management'}
          </h1>
          <p className="admin-user">Welcome, {localStorage.getItem('username') || 'Admin'}</p>
        </div>

        <div className="content-body">
          {activeSection === 'dashboard' && <DashboardStatistics />}
          
          {activeSection === 'admins' && <AdminManagement />}
          
          {activeSection === 'users' && <UserManagement />}
          
          {activeSection === 'volunteers' && <VolunteerManagement />}
          
          {activeSection === 'disasters' && <ActiveDisasterManagement />}
          
          {activeSection === 'help-requests' && <HelpRequestManagement />}
          
          {activeSection === 'missing-persons' && <MissingPersonManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
