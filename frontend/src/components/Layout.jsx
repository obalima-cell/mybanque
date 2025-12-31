import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-left">
            <div className="logo">
              <span className="logo-icon">🏦</span>
              <div className="logo-text-container">
                <span className="logo-text">MyBanque</span>
                <span className="logo-subtitle">Votre partenaire financier</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="navbar-links">
            <button
              onClick={() => navigate('/dashboard')}
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              📊 Tableau de bord
            </button>
            
            <button
              onClick={() => navigate('/accounts')}
              className={`nav-link ${isActive('/accounts') ? 'active' : ''}`}
            >
              💳 Comptes
            </button>
            
            <button
              onClick={() => navigate('/transactions')}
              className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
            >
              📈 Transactions
            </button>
            
            <button
              onClick={() => navigate('/statement')}
              className={`nav-link ${isActive('/statement') ? 'active' : ''}`}
            >
              📋 Relevés
            </button>
          </div>

          {/* User Menu */}
          <div className="navbar-right">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-menu"
            >
              👤 Utilisateur ▼
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}