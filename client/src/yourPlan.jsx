// yourPlan.jsx
import React from 'react';
import './yourPlan.css';

const YourPlan = () => {
  const planData = [
    { day: 'Monday', activity: 'Mess Breakfast: 8:00 AM - 10:00 AM' },
    { day: 'Tuesday', activity: 'Mess Lunch: 12:00 PM - 2:00 PM' },
    { day: 'Wednesday', activity: 'Mess Dinner: 7:30 PM - 9:30 PM' },
    { day: 'Thursday', activity: 'Study Session: 3:00 PM - 5:00 PM' },
    { day: 'Friday', activity: 'Mess Breakfast: 8:00 AM - 10:00 AM' },
    { day: 'Saturday', activity: 'Free Day' },
    { day: 'Sunday', activity: 'Mess Brunch: 10:00 AM - 1:00 PM' },
  ];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Your Plan</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="plan-container">
        <h2>Weekly Schedule</h2>
        <ul className="plan-list">
          {planData.map((plan, index) => (
            <li key={index} className="plan-item">
              <span className="plan-day">{plan.day}:</span> {plan.activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YourPlan;