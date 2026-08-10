import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  const getUserInitial = () => {
    if (user?.user_id) {
      return user.user_id.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserType = () => {
    if (user?.usertype === 'A') return 'Administrator';
    if (user?.usertype === 'U') return 'User';
    return 'Staff';
  };

  const getUserStatus = () => {
    if (user?.user_status === 'A') return 'Active';
    if (user?.user_status === 'I') return 'Inactive';
    return 'Unknown';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account and settings</p>
      </div>

      <div className="profile-content">
        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="avatar-circle">{getUserInitial()}</div>
          <h2>{user?.user_id}</h2>
          <p className="user-type">{getUserType()}</p>
          <span className={`status-badge ${user?.user_status === 'A' ? 'active' : 'inactive'}`}>
            {getUserStatus()}
          </span>
        </div>

        {/* Information Card */}
        <div className="profile-info-card">
          <h3>Account Information</h3>

          <div className="info-group">
            <div className="info-item">
              <label>User ID</label>
              <p>{user?.user_id}</p>
            </div>
            <div className="info-item">
              <label>Account Type</label>
              <p>{getUserType()}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-item">
              <label>Account Status</label>
              <p>{getUserStatus()}</p>
            </div>
            <div className="info-item">
              <label>User ID</label>
              <p>{user?.id}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-item full-width">
              <label>Created On</label>
              <p>{user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div className="info-group">
            <div className="info-item full-width">
              <label>Last Updated</label>
              <p>{user?.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="profile-action-card">
          <h3>Account Actions</h3>

          <button className="action-button edit">
            <span>✏️</span>
            Edit Profile
          </button>

          <button className="action-button change-password">
            <span>🔒</span>
            Change Password
          </button>

          <button className="action-button danger">
            <span>⚠️</span>
            Delete Account
          </button>
        </div>

        {/* Security Card */}
        <div className="profile-security-card">
          <h3>Security Settings</h3>

          <div className="security-item">
            <div className="security-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <button className="security-button">Enable</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <h4>Active Sessions</h4>
              <p>Manage your active login sessions</p>
            </div>
            <button className="security-button">Manage</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <h4>Login History</h4>
              <p>View recent login activities</p>
            </div>
            <button className="security-button">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
