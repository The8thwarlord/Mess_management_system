// attendance.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './attendance.css';

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [absentDays, setAbsentDays] = useState(0);
  const currentDateForPayment = new Date('2025-03-22'); // Current date (March 22, 2025)

  // Duplicate paymentData from payment.jsx (in a real app, this would be shared via context or backend)
  const MONTHLY_PAYMENT = 2700;
  const paymentData = [
    {
      id: 1,
      date: '2025-03-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0,
      status: 'Completed',
    },
    {
      id: 2,
      date: '2025-02-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0,
      status: 'Completed',
    },
    {
      id: 3,
      date: '2025-01-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0,
      status: 'Completed',
    },
    {
      id: 4,
      date: '2024-12-01',
      amount: MONTHLY_PAYMENT,
      remaining: 0,
      status: 'Completed',
    },
  ];

  // Load attendance data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('studentAttendance');
    if (storedData) {
      setAttendanceData(JSON.parse(storedData));
    } else {
      // Initialize with sample data if localStorage is empty
      const initialData = {
        '2025-03-20': 'Present',
        '2025-03-19': 'Absent',
        '2025-03-18': 'Present',
        '2025-03-17': 'Present',
      };
      setAttendanceData(initialData);
      localStorage.setItem('studentAttendance', JSON.stringify(initialData));
    }
  }, []);

  // Save attendance data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(attendanceData).length > 0) {
      localStorage.setItem('studentAttendance', JSON.stringify(attendanceData));
    }
  }, [attendanceData]);

  // Calculate absent days for payment date
  useEffect(() => {
    // Find the most recent payment date
    const mostRecentPaymentDate = new Date(
      paymentData
        .map((payment) => new Date(payment.date))
        .sort((a, b) => b - a)[0] // Get the most recent payment date
    );

    // Find the latest date marked in attendanceData
    const attendanceDates = Object.keys(attendanceData)
      .map((date) => new Date(date))
      .sort((a, b) => b - a); // Sort in descending order
    const latestAttendanceDate = attendanceDates.length > 0 ? attendanceDates[0] : currentDateForPayment;

    // Use the later of currentDateForPayment and latestAttendanceDate as the end date
    const endDateForAbsentDays = latestAttendanceDate > currentDateForPayment ? latestAttendanceDate : currentDateForPayment;

    // Count absent days between the most recent payment date and the end date
    let absentCount = 0;
    const current = new Date(mostRecentPaymentDate);
    while (current <= endDateForAbsentDays) {
      const dateStr = current.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (attendanceData[dateStr] === 'Absent') {
        absentCount++;
      }
      current.setDate(current.getDate() + 1);
    }

    setAbsentDays(absentCount);
  }, [attendanceData, currentDateForPayment]);

  // Get the number of days in the current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate the calendar grid
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    const today = new Date('2025-03-22'); // Use the same current date for consistency
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayDate = new Date(year, month, day);
      const isFutureOrToday = dayDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const status = attendanceData[dateStr] || 'Unmarked';

      days.push(
        <div key={dateStr} className={`calendar-day ${status.toLowerCase()}`}>
          <span className="day-number">{day}</span>
          {isFutureOrToday && (
            <button
              onClick={() => markAbsent(dateStr)}
              disabled={status === 'Absent'}
              className="mark-absent-btn"
            >
              {status === 'Absent' ? 'Absent' : 'Mark Absent'}
            </button>
          )}
        </div>
      );
    }

    return days;
  };

  // Function to mark a day as absent
  const markAbsent = (dateStr) => {
    setAttendanceData((prev) => ({
      ...prev,
      [dateStr]: 'Absent',
    }));
    alert(`You have been marked absent for ${dateStr}`);
  };

  // Function to calculate the next payment date
  const calculateNextPaymentDate = useCallback(() => {
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
  }, [absentDays]);

  const nextPaymentDate = calculateNextPaymentDate();

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Attendance</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">←</button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="nav-btn">→</button>
        </div>
        <div className="calendar-grid">
          <div className="calendar-day-header">Sun</div>
          <div className="calendar-day-header">Mon</div>
          <div className="calendar-day-header">Tue</div>
          <div className="calendar-day-header">Wed</div>
          <div className="calendar-day-header">Thu</div>
          <div className="calendar-day-header">Fri</div>
          <div className="calendar-day-header">Sat</div>
          {generateCalendar()}
        </div>
        <div className="calendar-legend">
          <div className="legend-item present">Present</div>
          <div className="legend-item absent">Absent</div>
          <div className="legend-item unmarked">Unmarked</div>
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
    </div>
  );
};

export default Attendance;