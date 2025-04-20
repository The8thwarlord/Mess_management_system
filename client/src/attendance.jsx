import React, { useState, useEffect } from "react";
import "./attendance.css";

const API_URL = window.location.origin.includes("loca.lt")
  ? "https://your-backend-subdomain.loca.lt"
  : "http://localhost:5000";

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    }
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`${API_URL}/attendance/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setAttendanceData(data.attendance);
        } else {
          setMessage(data.error || "Error fetching attendance data");
          console.error("Backend error:", data.error);
        }
      } catch (error) {
        setMessage("Server error. Please try again.");
        console.error("Error fetching attendance data:", error);
      }
    };

    if (userId) {
      fetchAttendanceData();
    }
  }, [userId]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Updated: Mark unmarked past days as "Absent" in the calendar
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
  
    // Get registration date from attendanceData if available
    let registrationDate = null;
    if (attendanceData && attendanceData.length > 0) {
      // Find the earliest attendance record
      registrationDate = attendanceData
        .map(a => a.date)
        .sort()[0];
    }
  
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      let status = "Unmarked";
      if (attendanceData && Array.isArray(attendanceData)) {
        const record = attendanceData.find(a => a.date === dateStr);
        if (record) {
          status = record.status;
        } else {
          const todayStr = new Date().toISOString().split("T")[0];
          // Only mark as absent if date is after or equal to registrationDate
          if (
            dateStr < todayStr &&
            registrationDate &&
            dateStr >= registrationDate
          ) {
            status = "Absent";
          }
        }
      }
  
      days.push(
        <div
          key={dateStr}
          className={`calendar-day ${status.toLowerCase()}`}
          style={{
            backgroundColor:
              status === "Present"
                ? "#e0f7fa"
                : status === "Absent"
                ? "#ffebee"
                : "#fff",
            border: status === "Absent" ? "2px solid #ff6f61" : undefined,
          }}
        >
          <span className="day-number">{day}</span>
          {status === "Present" && (
            <span className="status-label" style={{ color: "#388e3c" }}>
              Present
            </span>
          )}
          {status === "Absent" && (
            <span className="status-label" style={{ color: "#d32f2f" }}>
              Absent
            </span>
          )}
        </div>
      );
    }
  
    return days;
  };
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Attendance</h1>
        
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="nav-btn">←</button>
          <h2>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
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
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Attendance;