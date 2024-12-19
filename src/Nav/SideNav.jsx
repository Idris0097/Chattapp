import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SideNav = ({ token, setToken }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="sidenav">
      <ul>
        {token && (
          <li>
            <h2 className="text-2xl font-light mb-4 text-gray-800">
              Välkommen, {username}!
            </h2>
          </li>
        )}
        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/chat">Chat</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default SideNav;

