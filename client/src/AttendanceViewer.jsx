import React, { useEffect, useState } from "react";
import "./dashboard.css";

const AttendanceViewer = () => {
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
        console.error("Error fetching attendance data:", error);
        setError("Failed to fetch attendance data. Please try again later.");
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="attendance-viewer">
      <h1>Attendance Records</h1>
      {error && <p className="error">{error}</p>}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{record.studentName}</td>
              <td>{record.email}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceViewer;