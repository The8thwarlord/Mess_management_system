import React, { useEffect, useState } from "react";
import "./StudentInformation.css";

const staticStudents = [
  {
    _id: "static1",
    name: "Alice Johnson",
    email: "alice@example.com",
    rollNo: "CS2025001",
    branch: "Computer Science",
    yearOfStudy: "2nd",
    mobileNo: "9876543210",
    roomNo: "A-101",
  },
  {
    _id: "static2",
    name: "Bob Smith",
    email: "bob@example.com",
    rollNo: "EE2025002",
    branch: "Electrical",
    yearOfStudy: "3rd",
    mobileNo: "9876543211",
    roomNo: "B-202",
  },
  {
    _id: "static3",
    name: "Priya Patel",
    email: "priya@example.com",
    rollNo: "ME2025003",
    branch: "Mechanical",
    yearOfStudy: "1st",
    mobileNo: "9876543212",
    roomNo: "C-303",
  },
];

const StudentInformation = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/users");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        // If no students in DB, use static students for demo
        setStudents(data.length ? data : staticStudents);
      } catch (error) {
        setStudents(staticStudents); // fallback to static
        setError("Failed to fetch student information. Showing demo data.");
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Information</h1>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Branch</th>
              <th>Year</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>
                  <button
                    className="student-link"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1976d2",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontWeight: 600,
                    }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    {student.name}
                  </button>
                </td>
                <td>{student.rollNo || "-"}</td>
                <td>{student.email}</td>
                <td>{student.branch || "-"}</td>
                <td>{student.yearOfStudy || "-"}</td>
                <td>{student.roomNo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Profile Modal/Card */}
      {selectedStudent && (
        <div className="student-profile-modal" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "32px 36px",
            minWidth: "320px",
            maxWidth: "95vw",
            boxShadow: "0 4px 24px rgba(25, 118, 210, 0.10)",
            textAlign: "left",
            position: "relative"
          }}>
            <button
              style={{
                position: "absolute",
                top: 12, right: 18,
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "#888",
                cursor: "pointer"
              }}
              onClick={() => setSelectedStudent(null)}
              title="Close"
            >×</button>
            <h2 style={{ color: "#1976d2", marginBottom: 18 }}>{selectedStudent.name}'s Profile</h2>
            <p><b>Email:</b> {selectedStudent.email}</p>
            <p><b>Roll No:</b> {selectedStudent.rollNo || "-"}</p>
            <p><b>Branch:</b> {selectedStudent.branch || "-"}</p>
            <p><b>Year of Study:</b> {selectedStudent.yearOfStudy || "-"}</p>
            <p><b>Mobile No:</b> {selectedStudent.mobileNo || "-"}</p>
            <p><b>Room No:</b> {selectedStudent.roomNo || "-"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInformation;