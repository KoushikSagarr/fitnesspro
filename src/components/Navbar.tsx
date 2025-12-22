import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: 'dashboard' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  const userName = user?.displayName || user?.email;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="welcome-message">Hello, {userName}!</h2>
        <div className="navbar-links">
          <a href="#" onClick={() => onNavigate('dashboard')} className="navbar-link">Dashboard</a>
          <a href="#" onClick={() => onNavigate('history')} className="navbar-link">Workout History</a>
        </div>
      </div>
      <div className="navbar-right">
        <button onClick={onLogout} className="logout-button">
          <i className="icon">🚪</i>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
