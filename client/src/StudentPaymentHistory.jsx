import React, { useEffect, useState } from "react";
import "./payment.css";

const API_URL = "http://localhost:5000";


const StudentPaymentHistory = ({ userId }) => {
  const [attendance, setAttendance] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/attendance/${userId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch attendance");
        }

        setAttendance(data.attendance || []);
        setPresentCount(data.presentCount || 0);
        setRegistrationDate(data.registrationDate);
        setNextPaymentDate(data.nextPaymentDate || null);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      fetchAttendance();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  const daysUntilPayment = nextPaymentDate ? 
    Math.ceil((new Date(nextPaymentDate) - new Date()) / (1000 * 60 * 60 * 24)) : 
    0;

  return (
    <div className="payment-table-container">
      <h2>Payment History</h2>
      <h3>
        Next Payment Date:{" "}
        {nextPaymentDate ? (
          <div>
            <span style={{ color: "blue" }}>{nextPaymentDate}</span>
            <br />
            <small style={{ color: "gray" }}>
              {daysUntilPayment > 0 
                ? `(${daysUntilPayment} days from today)`
                : "(Due today)"}
            </small>
          </div>
        ) : (
          <span style={{ color: "red" }}>Not enough present days yet</span>
        )}
      </h3>
      <p>
        Present days counted: <b>{presentCount}</b> / 30
      </p>
      <p>Registration Date: {registrationDate || "Not available"}</p>
      {presentCount > 0 && (
        <p>
          Progress: {((presentCount / 30) * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
};

export default StudentPaymentHistory;