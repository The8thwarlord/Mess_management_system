import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Reuse the shared dashboard styles

const StudentPaymentHistory = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/payments"); // Backend endpoint to fetch payment history
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setPaymentData(data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
        setError("Failed to fetch payment history. Please try again later.");
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Payment History</h1>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{payment.studentName}</td>
                <td>{payment.email}</td>
                <td>{payment.date}</td>
                <td>₹{payment.amount}</td>
                <td>
                  <span className={`status ${payment.status.toLowerCase()}`}>
                    {payment.status}
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

export default StudentPaymentHistory;