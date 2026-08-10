import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../image/lsm_logo.jpeg';

function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate('/profile');
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowProfileMenu(false);
    // Redirect to login
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user?.user_id) {
      return user.user_id.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const displayName = user?.user_id || 'User';

  return (
    <header className="header">
      <div className="brand">
        <img src={logo} alt="ERP Logo" className="brand-logo_img" />
      </div>

      <div className="search">
        <span className="search-icon">⌕</span>
        <input
          type="text"
          placeholder="Search requests, stock, reports..."
        />
      </div>

      <div className="header-actions">
        <div className="today-chip">
          <span className="chip-label">Today</span>
          <strong>Active</strong>
        </div>

        <button className="icon-button" aria-label="Notifications">
          <span className="bell-icon">!</span>
          <span className="notification-dot"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container">
          <button
            className="profile-button"
            onClick={handleProfileClick}
            aria-label="User profile menu"
          >
            <span className="profile-avatar">{getUserInitial()}</span>
            <span className="profile-name">{displayName}</span>
            <span className="live-dot" aria-label="User live"></span>
            <span className={`dropdown-arrow ${showProfileMenu ? 'open' : ''}`}>
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">{getUserInitial()}</div>
                <div className="profile-menu-info">
                  <div className="profile-menu-name">{displayName}</div>
                  <div className="profile-menu-type">
                    {user?.usertype === 'A' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </div>

              <div className="profile-menu-divider"></div>

              <button
                className="profile-menu-item"
                onClick={handleViewProfile}
              >
                <span className="menu-icon">👤</span>
                <span>View Profile</span>
              </button>

              <button
                className="profile-menu-item"
                onClick={() => {
                  setShowProfileMenu(false);
                }}
              >
                <span className="menu-icon">⚙️</span>
                <span>Settings</span>
              </button>

              <div className="profile-menu-divider"></div>

              <button
                className="profile-menu-item logout"
                onClick={handleLogout}
              >
                <span className="menu-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
