import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role == 'admin';

  const [isHovered, setIsHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  if (loading) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToAdminPanel = () => {
    navigate('/admins');
  };

  const adminButtonStyle = {
    backgroundColor: isHovered ? '#0056b3' : '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  };

  const logoutButtonStyle = {
    backgroundColor: logoutHovered ? '#3a4b5c' : 'transparent',
    border: '1px solid white',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  return (
    <header style={headerStyle}>
      <div style={leftSection}>
        <h1 style={titleStyle}>Auction Platform</h1>
        <h1 style={usernameStyle}>{user?.username}</h1>
      </div>

      <nav style={navStyle}>
        <Link to="/auctions" style={linkStyle}>Auctions</Link>
        <Link to="/create-auction" style={linkStyle}>Create Auction</Link>
        <Link to="/payment" style={linkStyle}>Payment</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
      </nav>

      <div style={rightSection}>
        {isAdmin && (
          <button
            onClick={goToAdminPanel}
            style={adminButtonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Admin Panel
          </button>
        )}
        {user ? (
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};

// 🔧 Styles

const headerStyle = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '15px 30px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const leftSection = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const navStyle = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
};

const rightSection = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
};

const titleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 'bold',
};

const usernameStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#ccc',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
};

export default Header;
