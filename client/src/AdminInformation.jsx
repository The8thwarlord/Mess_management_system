// AdminInformation.jsx
import React from 'react';
import '../dashboard.css'; // Import the shared dashboard styles

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

export default AdminInformation;