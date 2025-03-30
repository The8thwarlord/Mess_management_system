// payment.jsx
import React, { useEffect, useState, useCallback } from 'react';
import './payment.css';

const Payment = () => {
  const MONTHLY_PAYMENT = 2700; // Fixed payment amount per month

  const paymentData = [
    {
      id: 1,
      date: '2025-03-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0, // Will be calculated dynamically
      status: 'Completed',
    },
    {
      id: 2,
      date: '2025-02-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0, // Will be calculated dynamically
      status: 'Completed',
    },
    {
      id: 3,
      date: '2025-01-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0, // Will be calculated dynamically
      status: 'Completed',
    },
    {
      id: 4,
      date: '2024-12-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0, // Will be calculated dynamically
      status: 'Completed',
    },
  ];

  const [absentDays, setAbsentDays] = useState(0);
  const [adjustedPaymentData, setAdjustedPaymentData] = useState(paymentData);
  const [lastAttendanceData, setLastAttendanceData] = useState(null); // Track last attendance data to avoid unnecessary updates
  const currentDate = new Date('2025-03-22'); // Current date (March 22, 2025)

  // Function to calculate absent days and update payment data
  const updatePaymentData = useCallback(() => {
    const storedAttendance = localStorage.getItem('studentAttendance');
    const newAttendanceData = storedAttendance ? JSON.parse(storedAttendance) : {};

    // Convert objects to strings for comparison to avoid unnecessary updates
    const newAttendanceString = JSON.stringify(newAttendanceData);
    const lastAttendanceString = JSON.stringify(lastAttendanceData);

    if (newAttendanceString === lastAttendanceString) {
      return; // No changes in attendance data, skip update
    }

    setLastAttendanceData(newAttendanceData);

    // Find the most recent payment date
    const mostRecentPaymentDate = new Date(
      paymentData
        .map((payment) => new Date(payment.date))
        .sort((a, b) => b - a)[0] // Get the most recent payment date
    );

    // Find the latest date marked in attendanceData
    const attendanceDates = Object.keys(newAttendanceData)
      .map((date) => new Date(date))
      .sort((a, b) => b - a); // Sort in descending order
    const latestAttendanceDate = attendanceDates.length > 0 ? attendanceDates[0] : currentDate;

    // Use the later of currentDate and latestAttendanceDate as the end date
    const endDateForAbsentDays = latestAttendanceDate > currentDate ? latestAttendanceDate : currentDate;

    // Count absent days between the most recent payment date and the end date
    let absentCount = 0;
    const current = new Date(mostRecentPaymentDate);
    while (current <= endDateForAbsentDays) {
      const dateStr = current.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (newAttendanceData[dateStr] === 'Absent') {
        absentCount++;
      }
      current.setDate(current.getDate() + 1);
    }

    setAbsentDays(absentCount);

    // Calculate remaining balance considering absences
    const updatedPaymentData = paymentData.map((payment, index) => {
      const paymentDate = new Date(payment.date);
      const nextPaymentDate = new Date(paymentDate);
      nextPaymentDate.setDate(paymentDate.getDate() + 30); // Base 30-day cycle

      // Count absent days between this payment and the next payment (or end date for the most recent payment)
      let absencesInPeriod = 0;
      const startDate = new Date(paymentDate);
      const endDate = index === 0 ? endDateForAbsentDays : new Date(paymentData[index - 1]?.date || endDateForAbsentDays);
      const currentIter = new Date(startDate);

      while (currentIter <= endDate) {
        const dateStr = currentIter.toISOString().split('T')[0];
        if (newAttendanceData && newAttendanceData[dateStr] === 'Absent') {
          absencesInPeriod++;
        }
        currentIter.setDate(currentIter.getDate() + 1);
      }

      // Calculate expected payment amount considering absences
      const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const expectedAmount = MONTHLY_PAYMENT + (MONTHLY_PAYMENT * absencesInPeriod) / 30; // Prorate additional cost for absences
      const remaining = Math.max(0, Math.round(expectedAmount - payment.amount));

      // Update status based on remaining balance
      const status = remaining > 0 ? 'Pending' : 'Completed';

      return {
        ...payment,
        remaining,
        status,
      };
    });

    setAdjustedPaymentData(updatedPaymentData);
  }, [currentDate, lastAttendanceData, paymentData, MONTHLY_PAYMENT]);

  // Poll localStorage for changes every second
  useEffect(() => {
    updatePaymentData(); // Initial calculation

    const interval = setInterval(() => {
      updatePaymentData(); // Recalculate on interval
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [updatePaymentData]);

  // Function to calculate the next payment date
  const calculateNextPaymentDate = useCallback(() => {
    // Find the most recent payment date
    const mostRecentDate = paymentData
      .map((payment) => new Date(payment.date))
      .sort((a, b) => b - a)[0]; // Sort in descending order and take the first (most recent)

    if (!mostRecentDate) return 'N/A'; // Handle case where there are no payments

    // Add 30 days to the most recent payment date (base cycle)
    const nextPaymentDate = new Date(mostRecentDate);
    nextPaymentDate.setDate(mostRecentDate.getDate() + 30);

    // Add the number of absent days as a delay
    nextPaymentDate.setDate(nextPaymentDate.getDate() + absentDays);

    // Format the date as YYYY-MM-DD
    return nextPaymentDate.toISOString().split('T')[0];
  }, [absentDays, paymentData]);

  const nextPaymentDate = calculateNextPaymentDate();

  return (
    <div className="main-content">
      <div className="header">
        <h1>Payment History</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="payment-table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Amount Paid</th>
              <th>Remaining Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adjustedPaymentData.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
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
      <div className="next-payment">
        <h3>Next Payment Date</h3>
        <p>{nextPaymentDate}</p>
        {absentDays > 0 && (
          <p className="delay-note">
            (Delayed by {absentDays} day{absentDays !== 1 ? 's' : ''} due to absences)
          </p>
        )}
      </div>
    </div>
  );
};

export default Payment;