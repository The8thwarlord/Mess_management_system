// AdminAttendance.jsx
import React from 'react';
import '../dashboard.css'; // Import the shared dashboard styles

const AdminAttendance = () => {
  const attendanceData = [
    { id: 1, studentName: 'Jani Jasmin', date: '2025-03-01', status: 'Present' },
    { id: 2, studentName: 'Amit Sharma', date: '2025-03-01', status: 'Absent' },
    { id: 3, studentName: 'Priya Patel', date: '2025-03-01', status: 'Present' },
    { id: 4, studentName: 'Rahul Kumar', date: '2025-03-01', status: 'Absent' },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Attendance</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
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
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.studentName}</td>
                <td>{record.date}</td>
                <td>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendance;