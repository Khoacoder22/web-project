import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const Layout = ({ children }) => {
  const { isAuthenticated, isAdmin, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="banner">
      <div className="navbar">
        <img
          src="https://openlibrary.org/static/images/openlibrary-logo-tighter.svg"
          className="logo"
          alt="Logo"
        />
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="#">Contact us</Link></li>
        </ul>

        {isAuthenticated ? (
          <>
            <ul>
              <li>
                <span style={{ color: 'white', margin: '1rem', fontSize: '12px' }}>Hi, {username}</span>
              </li>
              <li>
              <Link to="/" onClick={handleLogoutClick}>log out</Link>
              </li>
            </ul>

            {isAdmin && (
              <div className="dropdown">
                <button className="dropbtn">Admin</button>
                <div className="dropdown-content">
                  <Link to="#">Order</Link>
                  <Link to="#">Contact storage</Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <ul>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </>
        )}
      </div>
      {children}
    </div>
  );
};

export default Layout;
