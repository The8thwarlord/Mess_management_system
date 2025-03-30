  import React, { useEffect, useState } from 'react';
  import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom';
  import './dashboard.css'; // Reuse the same CSS as dashboard.jsx
  import Profile from './profile'; // Reuse the Profile component
  import Logout from './logout'; // Reuse the Logout component

  // Student Payment History Component
  const StudentPaymentHistory = () => {
    const [students, setStudents] = useState([]);
    const [paymentData, setPaymentData] = useState([]);

    useEffect(() => {
      // Fetch all users
      const fetchUsers = async () => {
        try {
          const res = await fetch("http://localhost:5000/users");
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          console.log("Fetched Users:", data); // Log the fetched users
          setStudents(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }, []);

    useEffect(() => {
      // Fetch payment data for each student
      const fetchPaymentData = async () => {
        try {
          const paymentData = await Promise.all(
            students.map(async (student) => {
              const res = await fetch(`http://localhost:5000/payments/${student._id}`);
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              const data = await res.json();
              console.log(`Fetched Payment Data for ${student.name}:`, data); // Log the fetched payment data
              return data.map((payment) => ({
                ...payment,
                studentName: student.name,
              }));
            })
          );
          setPaymentData(paymentData.flat());
        } catch (error) {
          console.error("Error fetching payment data:", error);
        }
      };

      if (students.length > 0) {
        fetchPaymentData();
      }
    }, [students]);

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
                <th>Next Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{payment.studentName}</td>
                  <td>{payment.date}</td>
                  <td>₹{payment.amount}</td>
                  <td>₹{payment.remaining}</td>
                  <td>
                    <span className={`status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.nextPaymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Admin Attendance Component
  const AdminAttendance = () => {
    const attendanceData = [
      { id: 1, studentName: 'Aditya', date: '2025-03-01', status: 'Present' },
      // Add more attendance data as needed
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

  // Admin Menu Component
  const AdminMenu = () => {
    const menuData = [
      {
        day: 'Monday',
        breakfast: ['Idli', 'Sambar', 'Chutney'],
        lunch: ['Rice', 'Dal', 'Vegetable Curry'],
        dinner: ['Roti', 'Paneer Curry', 'Salad'],
      },
      {
        day: 'Tuesday',
        breakfast: ['Poha', 'Tea'],
        lunch: ['Pulao', 'Raita'],
        dinner: ['Noodles', 'Manchurian'],
      },
    ];

    return (
      <div className="main-content">
        <div className="header">
          <h1>Weekly Menu</h1>
          <button className="logout-btn">Log Out →</button>
        </div>
        <div className="menu-cards">
          {menuData.map((menu, index) => (
            <div key={index} className="card">
              <h3>{menu.day}</h3>
              <p><strong>Breakfast:</strong></p>
              <ul>
                {menu.breakfast.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p><strong>Lunch:</strong></p>
              <ul>
                {menu.lunch.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p><strong>Dinner:</strong></p>
              <ul>
                {menu.dinner.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Admin Information Component
  const AdminInformation = () => {
    const announcements = [
      { id: 1, title: 'Mess Closed on 2025-03-15', details: 'The mess will be closed for maintenance on March 15, 2025.' },
      { id: 2, title: 'Special Dinner', details: 'A special dinner will be held on March 20, 2025, to celebrate the festival.' },
    ];

    return (
      <div className="main-content">
        <div className="header">
          <h1>Announcements & Information</h1>
          <button className="logout-btn">Log Out →</button>
        </div>
        <div className="menu-cards">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="card">
              <h3>{announcement.title}</h3>
              <p>{announcement.details}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const location = useLocation(); // To determine the active route

    useEffect(() => {
      // For now, we'll use a static admin name since AdminLogin uses static credentials
      setAdminName('Admin');
    }, []);

    return (
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-title">HELLO ADMIN</h2>
          <div className="sidebar-greeting">
            <span className="greeting-icon">HI!</span>
            <span className="user-name">{adminName}</span>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className={location.pathname === '/admin-dashboard/student-payment-history' ? 'active' : ''}>
                <Link to="/admin-dashboard/student-payment-history">
                  <span className="icon">📊</span> Student Payment History
                </Link>
              </li>
              <li className={location.pathname === '/admin-dashboard/attendance' ? 'active' : ''}>
                <Link to="/admin-dashboard/attendance">
                  <span className="icon">⏰</span> Attendance
                </Link>
              </li>
              <li className={location.pathname === '/admin-dashboard/menu' ? 'active' : ''}>
                <Link to="/admin-dashboard/menu">
                  <span className="icon">🍽️</span> Menu
                </Link>
              </li>
              <li className={location.pathname === '/admin-dashboard/information' ? 'active' : ''}>
                <Link to="/admin-dashboard/information">
                  <span className="icon">ℹ️</span> Information
                </Link>
              </li>
            </ul>
          </nav>
          <div className="sidebar-account">
            <h3>ACCOUNT</h3>
            <ul>
              <li>
                <Link to="/admin-dashboard/profile">
                  <span className="icon">👤</span> Profile
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard/logout">
                  <span className="icon">🚪</span> Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <Routes>
            {/* Redirect from /admin-dashboard to /admin-dashboard/student-payment-history */}
            <Route path="/" element={<Navigate to="/admin-dashboard/student-payment-history" replace />} />
            <Route path="/student-payment-history" element={<StudentPaymentHistory />} />
            <Route path="/attendance" element={<AdminAttendance />} />
            <Route path="/menu" element={<AdminMenu />} />
            <Route path="/information" element={<AdminInformation />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    );
  };

  export default AdminDashboard;