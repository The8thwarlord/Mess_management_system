import React from "react";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./dashboard.css"; // Reuse the shared dashboard styles
import Profile from "./profile"; // Reuse the Profile component
import Logout from "./logout"; // Reuse the Logout component
import StudentPaymentHistory from "./StudentPaymentHistory"; // Payment History Component
import StudentInformation from "./StudentInformation"; // Student Information Component
import AdminScanner from "./AdminScanner"; // QR Scanner Component
import AttendanceViewer from "./AttendanceViewer"; // Attendance Viewer Component

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">HELLO ADMIN</h2>
        <nav className="sidebar-nav">
          <ul>
            <li
              className={
                location.pathname === "/admin-dashboard/student-information"
                  ? "active"
                  : ""
              }
            >
              <Link to="/admin-dashboard/student-information">
                <span className="icon">📊</span> Student Information
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-dashboard/payment-history"
                  ? "active"
                  : ""
              }
            >
              <Link to="/admin-dashboard/payment-history">
                <span className="icon">💳</span> Payment History
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-dashboard/scanner"
                  ? "active"
                  : ""
              }
            >
              <Link to="/admin-dashboard/scanner">
                <span className="icon">📷</span> QR Scanner
              </Link>
            </li>
            <li
              className={
                location.pathname === "/admin-dashboard/attendance"
                  ? "active"
                  : ""
              }
            >
              <Link to="/admin-dashboard/attendance">
                <span className="icon">⏰</span> Attendance Viewer
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-account">
          <h3>ACCOUNT</h3>
          <ul>
            <li>
              <Link to="/admin-dashboard/profile">
                <span className="icon">👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/admin-dashboard/logout">
                <span className="icon">🚪</span> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to="/admin-dashboard/student-information" replace />
            }
          />
          <Route
            path="/student-information"
            element={<StudentInformation />}
          />
          <Route
            path="/payment-history"
            element={<StudentPaymentHistory />}
          />
          <Route path="/scanner" element={<AdminScanner />} />
          <Route path="/attendance" element={<AttendanceViewer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;