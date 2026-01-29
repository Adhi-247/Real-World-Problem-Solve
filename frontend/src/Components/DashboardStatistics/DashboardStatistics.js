import React, { useState } from 'react';
import './DashboardStatistics.css';

const DashboardStatistics = () => {
  const [stats] = useState({
    totalUsers: 1247,
    totalVolunteers: 342,
    activeDisasters: 8,
    helpRequests: {
      total: 856,
      pending: 23,
      inProgress: 45,
      completed: 788
    },
    missingPersons: {
      total: 134,
      active: 12,
      found: 98,
      closed: 24
    },
    totalAdmins: 8
  });

  const [recentActivity] = useState([
    { id: 1, type: 'help', message: 'New help request from Colombo District', time: '5 min ago', priority: 'high' },
    { id: 2, type: 'volunteer', message: 'New volunteer registered - Kandy', time: '15 min ago', priority: 'low' },
    { id: 3, type: 'disaster', message: 'Flood alert updated - Galle', time: '32 min ago', priority: 'high' },
    { id: 4, type: 'missing', message: 'Missing person found - Jaffna', time: '1 hour ago', priority: 'medium' },
    { id: 5, type: 'user', message: '15 new user registrations today', time: '2 hours ago', priority: 'low' },
  ]);

  const [disasterTypes] = useState([
    { name: 'Floods', count: 3, percentage: 37.5 },
    { name: 'Landslides', count: 2, percentage: 25 },
    { name: 'Cyclones', count: 1, percentage: 12.5 },
    { name: 'Tsunamis', count: 1, percentage: 12.5 },
    { name: 'Wildfires', count: 1, percentage: 12.5 },
  ]);

  const [regionalData] = useState([
    { region: 'Western Province', users: 423, active: 3 },
    { region: 'Central Province', users: 256, active: 2 },
    { region: 'Southern Province', users: 198, active: 1 },
    { region: 'Northern Province', users: 134, active: 1 },
    { region: 'Eastern Province', users: 236, active: 1 },
  ]);

  const [performanceMetrics] = useState({
    avgResponseTime: '1.2 hours',
    completionRate: '92%',
    volunteerResponseRate: '87%',
    successRate: '73%'
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'help': return '🆘';
      case 'volunteer': return '🤝';
      case 'disaster': return '🌊';
      case 'missing': return '🔍';
      case 'user': return '👤';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="dashboard-statistics">
      {/* Overview Cards */}
      <div className="stats-overview-section">
        <h2 className="section-title">📊 Overview</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-trend positive">+12% this month</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🤝</div>
            <div className="stat-details">
              <h3>{stats.totalVolunteers.toLocaleString()}</h3>
              <p>Active Volunteers</p>
              <span className="stat-trend positive">+8% this month</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🌊</div>
            <div className="stat-details">
              <h3>{stats.activeDisasters}</h3>
              <p>Active Disasters</p>
              <span className="stat-trend negative">2 new today</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">📋</div>
            <div className="stat-details">
              <h3>{stats.helpRequests.pending}</h3>
              <p>Pending Requests</p>
              <span className="stat-trend">Need attention</span>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">🔍</div>
            <div className="stat-details">
              <h3>{stats.missingPersons.active}</h3>
              <p>Missing Persons</p>
              <span className="stat-trend">Active cases</span>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-details">
              <h3>{stats.totalAdmins}</h3>
              <p>System Admins</p>
              <span className="stat-trend">All active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Help Requests Breakdown */}
      <div className="section-row">
        <div className="chart-card">
          <h3 className="card-title">📋 Help Requests Status</h3>
          <div className="requests-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '10%', background: '#e74c3c' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">Pending</span>
                <span className="breakdown-value">{stats.helpRequests.pending}</span>
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '25%', background: '#f39c12' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">In Progress</span>
                <span className="breakdown-value">{stats.helpRequests.inProgress}</span>
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '100%', background: '#27ae60' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">Completed</span>
                <span className="breakdown-value">{stats.helpRequests.completed}</span>
              </div>
            </div>
          </div>
          <div className="total-count">
            Total: <strong>{stats.helpRequests.total}</strong> requests
          </div>
        </div>

        <div className="chart-card">
          <h3 className="card-title">🔍 Missing Persons Status</h3>
          <div className="requests-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '15%', background: '#e74c3c' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">Active Search</span>
                <span className="breakdown-value">{stats.missingPersons.active}</span>
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '90%', background: '#27ae60' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">Found</span>
                <span className="breakdown-value">{stats.missingPersons.found}</span>
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-bar" style={{ width: '30%', background: '#95a5a6' }}></div>
              <div className="breakdown-info">
                <span className="breakdown-label">Closed</span>
                <span className="breakdown-value">{stats.missingPersons.closed}</span>
              </div>
            </div>
          </div>
          <div className="total-count">
            Total: <strong>{stats.missingPersons.total}</strong> cases
          </div>
        </div>
      </div>

      {/* Disaster Types & Performance */}
      <div className="section-row">
        <div className="chart-card">
          <h3 className="card-title">🌊 Disaster Distribution</h3>
          <div className="disaster-list">
            {disasterTypes.map((disaster, index) => (
              <div key={index} className="disaster-item">
                <div className="disaster-name">
                  <span className="disaster-dot" style={{ background: `hsl(${index * 60}, 70%, 50%)` }}></span>
                  {disaster.name}
                </div>
                <div className="disaster-stats">
                  <div className="disaster-bar-container">
                    <div 
                      className="disaster-bar" 
                      style={{ 
                        width: `${disaster.percentage}%`,
                        background: `hsl(${index * 60}, 70%, 50%)`
                      }}
                    ></div>
                  </div>
                  <span className="disaster-count">{disaster.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="card-title">⚡ Performance Metrics</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <div className="performance-icon">⏱️</div>
              <div className="performance-details">
                <h4>{performanceMetrics.avgResponseTime}</h4>
                <p>Avg Response Time</p>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-icon">✅</div>
              <div className="performance-details">
                <h4>{performanceMetrics.completionRate}</h4>
                <p>Completion Rate</p>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-icon">🤝</div>
              <div className="performance-details">
                <h4>{performanceMetrics.volunteerResponseRate}</h4>
                <p>Volunteer Response</p>
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-icon">🎯</div>
              <div className="performance-details">
                <h4>{performanceMetrics.successRate}</h4>
                <p>Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Data & Recent Activity */}
      <div className="section-row">
        <div className="chart-card">
          <h3 className="card-title">📍 Regional Activity</h3>
          <div className="regional-table">
            <table>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Users</th>
                  <th>Active Disasters</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {regionalData.map((region, index) => (
                  <tr key={index}>
                    <td>{region.region}</td>
                    <td>{region.users}</td>
                    <td>
                      <span className={`disaster-badge ${region.active > 2 ? 'high' : region.active > 0 ? 'medium' : 'low'}`}>
                        {region.active}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${region.active > 0 ? 'alert' : 'normal'}`}>
                        {region.active > 0 ? 'Alert' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="card-title">🔔 Recent Activity</h3>
          <div className="activity-feed">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div 
                  className="activity-priority" 
                  style={{ background: getPriorityColor(activity.priority) }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="action-btn primary">
            <span className="action-icon">🌊</span>
            <span>Create Disaster Alert</span>
          </button>
          <button className="action-btn success">
            <span className="action-icon">✅</span>
            <span>Approve Pending Requests</span>
          </button>
          <button className="action-btn warning">
            <span className="action-icon">👨‍💼</span>
            <span>Add New Admin</span>
          </button>
          <button className="action-btn info">
            <span className="action-icon">📧</span>
            <span>Send Notification</span>
          </button>
          <button className="action-btn secondary">
            <span className="action-icon">📊</span>
            <span>Generate Report</span>
          </button>
          <button className="action-btn danger">
            <span className="action-icon">🚨</span>
            <span>Emergency Broadcast</span>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="system-health-section">
        <h2 className="section-title">💻 System Health</h2>
        <div className="health-grid">
          <div className="health-item">
            <div className="health-header">
              <span>Server Status</span>
              <span className="health-status online">● Online</span>
            </div>
            <div className="health-bar">
              <div className="health-bar-fill" style={{ width: '98%', background: '#27ae60' }}></div>
            </div>
            <span className="health-value">98% Uptime</span>
          </div>
          <div className="health-item">
            <div className="health-header">
              <span>Database</span>
              <span className="health-status online">● Connected</span>
            </div>
            <div className="health-bar">
              <div className="health-bar-fill" style={{ width: '95%', background: '#27ae60' }}></div>
            </div>
            <span className="health-value">95% Performance</span>
          </div>
          <div className="health-item">
            <div className="health-header">
              <span>API Response</span>
              <span className="health-status online">● Fast</span>
            </div>
            <div className="health-bar">
              <div className="health-bar-fill" style={{ width: '92%', background: '#27ae60' }}></div>
            </div>
            <span className="health-value">142ms Avg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatistics;
