import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-mark">
          <span>E</span>
        </div>
        <div>
          <div className="logo">ERP</div>
          <div className="brand-subtitle">Operations Desk</div>
        </div>
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

        <div className="profile">
          <span className="profile-avatar">L</span>
          <span className="profile-name">Lokesh</span>
          <span className="live-dot" aria-label="User live"></span>
        </div>
      </div>
    </header>
  );
}

export default Header;
