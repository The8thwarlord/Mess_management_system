// StudentPaymentHistory.jsx
import React from 'react';
import '../dashboard.css'; // Import the shared dashboard styles

const StudentPaymentHistory = () => {
  const paymentData = [
    { id: 1, studentName: 'Jani Jasmin', date: '2025-03-01', amount: 5000, remaining: 2000, status: 'Pending' },
    { id: 2, studentName: 'Amit Sharma', date: '2025-02-15', amount: 6000, remaining: 0, status: 'Completed' },
    { id: 3, studentName: 'Priya Patel', date: '2025-01-10', amount: 4500, remaining: 1500, status: 'Pending' },
    { id: 4, studentName: 'Rahul Kumar', date: '2024-12-20', amount: 7000, remaining: 0, status: 'Completed' },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Student Payment History</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Date</th>
              <th>Amount Paid</th>
              <th>Remaining Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.studentName}</td>
                <td>{payment.date}</td>
                <td>₹{payment.amount}</td>
                <td>₹{payment.remaining}</td>
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