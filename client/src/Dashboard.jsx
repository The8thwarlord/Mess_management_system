import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './dashboard.css';
import Payment from './payment';
import Attendance from './attendance';
import YourPlan from './yourPlan';
import UserMenu from './userMenu';
import Information from './information';
import Profile from './profile';
import Logout from './logout';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null); // To store user-specific data
  const location = useLocation(); // To determine the active route

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    }

    // Fetch user-specific data
    const fetchUserData = async () => {
      if (user && user._id) {
        try {
          const res = await fetch(`http://localhost:5000/user/${user._id}`);
          const data = await res.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">HELLO USER</h2>
        <div className="sidebar-greeting">
          <span className="greeting-icon">HI!</span>
          <span className="user-name">{userName}</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/dashboard/payment-history' ? 'active' : ''}>
              <Link to="/dashboard/payment-history">
                <span className="icon">📊</span> PAYMENT HISTORY
              </Link>
            </li>
            <li className={location.pathname === '/dashboard/attendance' ? 'active' : ''}>
              <Link to="/dashboard/attendance">
                <span className="icon">⏰</span> ATTENDANCE
              </Link>
            </li>
            <li className={location.pathname === '/dashboard/your-plan' ? 'active' : ''}>
              <Link to="/dashboard/your-plan">
                <span className="icon">📅</span> YOUR PLAN
              </Link>
            </li>
            <li className={location.pathname === '/dashboard/user-menu' ? 'active' : ''}>
              <Link to="/dashboard/user-menu">
                <span className="icon">📋</span> USER MENU
              </Link>
            </li>
            <li className={location.pathname === '/dashboard/information' ? 'active' : ''}>
              <Link to="/dashboard/information">
                <span className="icon">ℹ️</span> INFORMATION
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-account">
          <h3>ACCOUNT</h3>
          <ul>
            <li>
              <Link to="/dashboard/profile">
                <span className="icon">👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/dashboard/logout">
                <span className="icon">🚪</span> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          {/* Redirect from /dashboard to /dashboard/payment-history */}
          <Route path="/" element={<Navigate to="/dashboard/payment-history" replace />} />
          <Route path="/payment-history" element={<Payment userData={userData} />} />
          <Route path="/attendance" element={<Attendance userData={userData} />} />
          <Route path="/your-plan" element={<YourPlan />} />
          <Route path="/user-menu" element={<UserMenu />} />
          <Route path="/information" element={<Information />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;