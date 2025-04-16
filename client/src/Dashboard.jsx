import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import QRCode from "react-qr-code";
import "./dashboard.css";
import StudentPaymentHistory from "./StudentPaymentHistory";
import Attendance from "./attendance";

import UserMenu from "./userMenu";
import Information from "./information";
import Profile from "./profile";
import Logout from "./logout";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null); // To store user-specific data
  const [qrData, setQrData] = useState(null); // To store QR code data
  const [message, setMessage] = useState(""); // To display success or error messages
  const location = useLocation(); // To determine the active route

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage
      if (user && user._id) {
        try {
          const res = await fetch(`http://localhost:5000/user/${user._id}`); // Fetch user-specific data
          const data = await res.json();
          setUserData(data); // Set the user-specific data
          setUserName(data.name); // Set the user's name
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      const qrPayload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        meal: "Lunch",
        date: new Date().toISOString(),
      };
      setQrData(JSON.stringify(qrPayload));
    }
  }, []);

  const handleMealScan = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      setMessage("User not logged in.");
      return;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

    try {
      const res = await fetch(`http://localhost:5000/user/${user._id}/mark-attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: currentDate }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Attendance marked successfully!");
      } else {
        setMessage(data.error || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("Server error. Please try again.");
    }
  };

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
            <li className={location.pathname === "/dashboard/payment-history" ? "active" : ""}>
              <Link to="/dashboard/payment-history">
                <span className="icon">📊</span> PAYMENT HISTORY
              </Link>
            </li>
            <li className={location.pathname === "/dashboard/attendance" ? "active" : ""}>
              <Link to="/dashboard/attendance">
                <span className="icon">⏰</span> ATTENDANCE
              </Link>
            </li>
            
            <li className={location.pathname === "/dashboard/user-menu" ? "active" : ""}>
              <Link to="/dashboard/user-menu">
                <span className="icon">📋</span> USER MENU
              </Link>
            </li>
            <li className={location.pathname === "/dashboard/meal-scan" ? "active" : ""}>
              <Link to="/dashboard/meal-scan">
                <span className="icon">🍽️</span> MEAL SCAN
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
          <Route path="/" element={<Navigate to="/dashboard/payment-history" replace />} />
          <Route path="/payment-history" element={<StudentPaymentHistory userId={userData?._id} />} />
          <Route path="/attendance" element={<Attendance userData={userData} />} />
       
          <Route path="/user-menu" element={<UserMenu />} />
          <Route path="/information" element={<Information />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/meal-scan"
            element={
              <div className="meal-scan-section">
                <h1>Meal Scan</h1>
                <p>Scan this QR code at the mess to validate your meal:</p>
                {qrData && (
                  <div className="qr-code-container">
                    <QRCode value={qrData} size={256} />
                  </div>
                )}
                
                {message && <p className="message">{message}</p>}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;