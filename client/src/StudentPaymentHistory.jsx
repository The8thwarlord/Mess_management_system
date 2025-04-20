import React, { useEffect, useState } from "react";
import "./StudentPaymentHistory.css";

const API_URL = "http://localhost:5000";
const REQUIRED_PAYMENT = 2700;
const PAYMENT_CYCLE_DAYS = 28;

function calculateNextPaymentDateFromAttendance(attendance) {
  if (!attendance || attendance.length === 0) return "-";
  // Sort attendance by date ascending
  const sorted = [...attendance].sort((a, b) => new Date(a.date) - new Date(b.date));
  // Find the first "Present" date
  const firstPresent = sorted.find(a => a.status === "Present");
  if (!firstPresent) return "-";
  // Take the first 28 attendance records starting from the first present
  const startIdx = sorted.findIndex(a => a.date === firstPresent.date);
  const cycleRecords = sorted.slice(startIdx, startIdx + PAYMENT_CYCLE_DAYS);
  // Count absents in this cycle
  const absentCount = cycleRecords.filter(a => a.status === "Absent").length;
  // Next payment date is 28 days after first present, plus absent days
  const baseDate = new Date(firstPresent.date);
  baseDate.setDate(baseDate.getDate() + PAYMENT_CYCLE_DAYS + absentCount);
  return baseDate.toISOString().split("T")[0];
}

const StudentPaymentHistory = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch student info (including payments array)
        const res = await fetch(`${API_URL}/user/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch payment history");
        setStudent(data);
        setPayments(Array.isArray(data.payments) ? data.payments : []);

        // Fetch attendance
        const attRes = await fetch(`${API_URL}/attendance/${userId}`);
        const attData = await attRes.json();
        if (attRes.ok && Array.isArray(attData.attendance)) {
          setAttendance(attData.attendance);
        } else {
          setAttendance([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  // Calculate total paid and due (sum all payments)
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalDue = Math.max(REQUIRED_PAYMENT - totalPaid, 0);
  const nextPaymentDate = calculateNextPaymentDateFromAttendance(attendance);

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Payment History</h1>
      </div>
      <div className="payment-table-container">
        {student && (
          <div style={{ marginBottom: 20 }}>
            <b>Name:</b> {student.name} <br />
            <b>Roll No:</b> {student.rollNo || "-"} <br />
            <b>Email:</b> {student.email}
          </div>
        )}
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment Date</th>
              <th>Amount Paid (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>
                  No payment records found.
                </td>
              </tr>
            )}
            {payments.reduce(
              (acc, payment, idx) => {
                acc.runningTotal += payment.amount || 0;
                acc.rows.push(
                  <tr key={payment._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{payment.date || "-"}</td>
                    <td>{payment.amount || 0}</td>
                    <td>
                      <span
                        className="status"
                        style={{
                          background:
                            acc.runningTotal >= REQUIRED_PAYMENT
                              ? "#4caf50"
                              : "#ff6f61",
                          color: "#fff",
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {acc.runningTotal >= REQUIRED_PAYMENT ? "Paid" : "Due"}
                      </span>
                    </td>
                  </tr>
                );
                return acc;
              },
              { runningTotal: 0, rows: [] }
            ).rows}
          </tbody>
        </table>
        <div style={{ marginTop: 24, fontWeight: 600 }}>
          Total Paid: <span style={{ color: "#388e3c" }}>₹{totalPaid}</span>
          {" | "}
          Total Due:{" "}
          <span style={{ color: totalDue === 0 ? "#388e3c" : "#e53935" }}>
            ₹{totalDue}
          </span>
        </div>
        <div style={{ marginTop: 12, fontWeight: 600 }}>
          Next Payment Date:{" "}
          <span style={{ color: "#1976d2" }}>{nextPaymentDate}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentHistory;