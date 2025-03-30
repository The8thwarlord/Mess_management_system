// information.jsx
import React from 'react';
import './information.css';

const Information = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Information</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="info-container">
        <h2>Mess Rules & Guidelines</h2>
        <ul className="info-list">
          <li>Arrive on time for meals as per the schedule.</li>
          <li>Maintain hygiene and cleanliness in the mess area.</li>
          <li>Do not waste food; take only what you can eat.</li>
          <li>Follow the dress code while in the mess.</li>
          <li>Contact the mess manager for any complaints or suggestions.</li>
        </ul>
        <h2>Contact Details</h2>
        <p>Mess Manager: Mr. John Doe</p>
        <p>Phone: +91 98765 43210</p>
        <p>Email: mess.manager@example.com</p>
      </div>
    </div>
  );
};

export default Information;