import React, { useEffect, useState } from "react";
import "./StudentPaymentHistory.css"; // Reuse table styles

const API_URL = "http://localhost:5000";

const AttendanceViewer = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (!res.ok) throw new Error("Failed to fetch attendance");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        setError("Failed to fetch attendance data.");
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Attendance Records</h1>
      </div>
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Total Days</th>
              <th>Days Present</th>
              <th>Days Absent</th>
              <th>Attendance %</th>
              <th>Last Present</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const attendanceArr = Array.isArray(student.attendance) ? student.attendance : [];
              const totalDays = attendanceArr.length;
              const presentDays = attendanceArr.filter(a => a.status === "Present").length;
              const absentDays = totalDays - presentDays;
              const percent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
              const lastPresent = attendanceArr
                .slice()
                .reverse()
                .find(a => a.status === "Present")?.date || "-";
              return (
                <tr key={student._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.rollNo || "-"}</td>
                  <td>{student.email}</td>
                  <td>{totalDays}</td>
                  <td style={{ color: "#388e3c", fontWeight: 600 }}>{presentDays}</td>
                  <td style={{ color: "#e53935", fontWeight: 600 }}>{absentDays}</td>
                  <td style={{ fontWeight: 600 }}>{percent}%</td>
                  <td>{lastPresent}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {students.length === 0 && (
          <div className="no-data-message">
            <p>No attendance records found.</p>
          </div>
        )}
        {error && (
          <div className="no-data-message" style={{ color: "#e53935" }}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceViewer;