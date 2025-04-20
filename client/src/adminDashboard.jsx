import React, { useState } from "react";
import { Link, Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./dashboard.css";
import Profile from "./profile";
import Logout from "./logout";
import StudentPaymentHistory from "./PaymentViewer";
import StudentInformation from "./StudentInformation";
import AttendanceViewer from "./AttendanceViewer";

// --- New: MarkPayment Component ---
const API_URL = "http://localhost:5000";
const MarkPayment = () => {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetch(`${API_URL}/users`)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setStudents([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/${selectedId}/mark-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          date: new Date().toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Payment marked successfully!");
      } else {
        setMessage(data.error || "Failed to mark payment.");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Mark Student Payment</h1>
      </div>
      <form className="payment-table-container" onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 18 }}>
          <label>
            Student:
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              required
              style={{ marginLeft: 10, padding: 6, minWidth: 200 }}
            >
              <option value="">Select student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNo || s.email})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            Amount (₹):
            <input
              type="number"
              min="1"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              style={{ marginLeft: 10, padding: 6, width: 120 }}
            />
          </label>
        </div>
        <button
          type="submit"
          className="auth-btn"
          disabled={loading || !selectedId || !amount}
          style={{ marginTop: 10 }}
        >
          {loading ? "Marking..." : "Mark Payment"}
        </button>
        {message && (
          <div style={{ marginTop: 18, color: message.startsWith("✅") ? "#388e3c" : "#e53935" }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
// --- End MarkPayment Component ---

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
            {/* --- New: Mark Payment Tab --- */}
            <li
              className={
                location.pathname === "/admin-dashboard/mark-payment"
                  ? "active"
                  : ""
              }
            >
              <Link to="/admin-dashboard/mark-payment">
                <span className="icon">💵</span> Mark Payment
              </Link>
            </li>
            {/* --- End New Tab --- */}
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
          {/* --- New: Mark Payment Route --- */}
          <Route
            path="/mark-payment"
            element={<MarkPayment />}
          />
          {/* --- End New Route --- */}
          <Route path="/attendance" element={<AttendanceViewer />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;