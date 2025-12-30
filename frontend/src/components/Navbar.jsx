import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { path: "/dashboard", label: "Tableau de bord", icon: "📊" },
    { path: "/accounts", label: "Comptes", icon: "💳" },
    { path: "/transactions", label: "Transactions", icon: "📜" },
    { path: "/statement", label: "Relevés", icon: "📄" }
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo & Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-icon">🏦</span>
            <div className="brand-ring"></div>
          </div>
          <div className="brand-text">
            <span className="brand-name">MyBanque</span>
            <span className="brand-tagline">Votre partenaire financier</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${isActive(path) ? "active" : ""}`}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
              {isActive(path) && <div className="nav-indicator"></div>}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="navbar-actions">
          {/* Notification Bell */}
          <button className="action-btn notification-btn">
            <span className="action-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
            >
              <div className="profile-avatar">
                <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name || "Utilisateur"}</span>
                <span className="profile-email">{user?.email}</span>
              </div>
              <span className="profile-arrow">{showProfileMenu ? "▲" : "▼"}</span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu">
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <span className="dropdown-icon">👤</span>
                  <span>Mon profil</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="dropdown-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <span className="dropdown-icon">⚙️</span>
                  <span>Paramètres</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <span className="dropdown-icon">🚪</span>
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu mobile"
          >
            <span className={`hamburger ${showMobileMenu ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-user-info">
              <div className="mobile-avatar">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="mobile-user-name">{user?.name || "Utilisateur"}</div>
                <div className="mobile-user-email">{user?.email}</div>
              </div>
            </div>
          </div>

          <div className="mobile-menu-nav">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`mobile-nav-link ${isActive(path) ? "active" : ""}`}
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="mobile-nav-icon">{icon}</span>
                <span className="mobile-nav-label">{label}</span>
                {isActive(path) && <span className="mobile-nav-check">✓</span>}
              </Link>
            ))}
          </div>

          <div className="mobile-menu-footer">
            <Link
              to="/profile"
              className="mobile-footer-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <span>👤</span>
              <span>Mon profil</span>
            </Link>
            <Link
              to="/settings"
              className="mobile-footer-link"
              onClick={() => setShowMobileMenu(false)}
            >
              <span>⚙️</span>
              <span>Paramètres</span>
            </Link>
            <button onClick={handleLogout} className="mobile-footer-link logout">
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(showMobileMenu || showProfileMenu) && (
        <div
          className="navbar-overlay"
          onClick={() => {
            setShowMobileMenu(false);
            setShowProfileMenu(false);
          }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;