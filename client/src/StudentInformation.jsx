import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Reuse the shared dashboard styles

const StudentInformation = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/users"); // Backend endpoint to fetch student information
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student information:", error);
        setError("Failed to fetch student information. Please try again later.");
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
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentInformation;