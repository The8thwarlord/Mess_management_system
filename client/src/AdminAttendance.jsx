import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Reuse the shared dashboard styles

const AdminAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("http://localhost:5000/attendance");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError("Failed to fetch attendance. Please try again later.");
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Attendance</h1>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student, index) =>
              student.attendance.map((record, i) => (
                <tr key={`${student._id}-${i}`}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{record.date}</td>
                  <td>
                    <span className={`status ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;