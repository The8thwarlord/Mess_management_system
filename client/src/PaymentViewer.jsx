import React, { useEffect, useState } from "react";
import "./StudentPaymentHistory.css";

const API_URL = "http://localhost:5000";
const REQUIRED_PAYMENT = 2700;
const PAYMENT_CYCLE_DAYS = 28;

// Calculate next payment date from attendance
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

const StudentPaymentHistory = () => {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data);

        // Fetch attendance for each student
        const attendanceResults = await Promise.all(
          data.map(async (student) => {
            try {
              const attRes = await fetch(`${API_URL}/attendance/${student._id}`);
              if (!attRes.ok) return { id: student._id, attendance: [] };
              const attData = await attRes.json();
              return { id: student._id, attendance: attData.attendance || [] };
            } catch {
              return { id: student._id, attendance: [] };
            }
          })
        );
        // Build a map: studentId -> attendance array
        const attMap = {};
        attendanceResults.forEach(({ id, attendance }) => {
          attMap[id] = attendance;
        });
        setAttendanceMap(attMap);
      } catch (err) {
        setError("Failed to fetch student payment history.");
      }
    };
    fetchStudents();
  }, []);

  const getPaymentInfo = (student) => {
    if (!student.payments || student.payments.length === 0) {
      return {
        lastPayment: "No payment yet",
        due: REQUIRED_PAYMENT,
        progress: 0,
        nextDue: calculateNextPaymentDateFromAttendance(attendanceMap[student._id]),
      };
    }
    // Sum all payments for total paid
    const totalPaid = student.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const sorted = [...student.payments].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const last = sorted[0];
    const progress = Math.min(100, Math.round((totalPaid / REQUIRED_PAYMENT) * 100));
    return {
      lastPayment: last.date,
      due: totalPaid >= REQUIRED_PAYMENT ? 0 : REQUIRED_PAYMENT - totalPaid,
      progress,
      nextDue: calculateNextPaymentDateFromAttendance(attendanceMap[student._id]),
    };
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Payment History</h1>
      </div>
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Last Payment</th>
              <th>Due Payment</th>
              <th>Next Due Date</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const { lastPayment, due, progress, nextDue } = getPaymentInfo(student);
              return (
                <tr key={student._id}>
                  <td>{idx + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.rollNo || "-"}</td>
                  <td>{student.email}</td>
                  <td>{lastPayment}</td>
                  <td style={{ color: due === 0 ? "#388e3c" : "#e53935", fontWeight: 600 }}>
                    {due === 0 ? "No due" : `₹${due}`}
                  </td>
                  <td>{nextDue}</td>
                  <td>
                    <div style={{
                      background: "#e3f0ff",
                      borderRadius: 8,
                      width: 100,
                      height: 18,
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(25,118,210,0.06)"
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: progress === 100 ? "#4caf50" : "#1976d2",
                        transition: "width 0.5s",
                        borderRadius: 8,
                      }}></div>
                      <span style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        textAlign: "center",
                        fontSize: 13,
                        color: "#222",
                        fontWeight: 600,
                        lineHeight: "18px"
                      }}>{progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="no-data-message">
            <p>No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPaymentHistory;