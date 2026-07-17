import React from "react";
import "./Navbar.css";

const Navbar = ({ onProfileClick, onLogout }) => {
  const handleLogout = () => {
    // TODO: Clear token/session and call your logout API here.
    // await fetch("/api/logout", { method: "POST" });

    if (window.confirm("Are you sure you want to log out?")) {
      onLogout?.();
    }
  };

  return (
    <header className="app-navbar">
      <div className="navbar-brand">
        <div className="brand-logo">F</div>
        <span>FinanceFlow</span>
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="nav-icon-btn profile-nav-btn"
          onClick={onProfileClick}
          title="My Profile"
          aria-label="My Profile"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z" />
          </svg>
          <span>Profile</span>
        </button>

        <span className="navbar-divider" />

        <button
          type="button"
          className="nav-icon-btn logout-nav-btn"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5v-2H5V5h5V3Zm4.3 4.3-1.4 1.4 2.3 2.3H8v2h7.2l-2.3 2.3 1.4 1.4 4.7-4.7-4.7-4.7Z" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;