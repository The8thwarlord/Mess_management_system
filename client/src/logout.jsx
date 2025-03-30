// logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('user');
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/'); // Changed from '/login' to '/'
    }, 2000);
  }, [navigate]);

  return (
    <div className="main-content">
      <div className="logout-container">
        <h1>Logging Out...</h1>
        <p>You will be redirected to the home page shortly.</p>
      </div>
    </div>
  );
};

export default Logout;