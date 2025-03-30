// AdminMenu.jsx
import React from 'react';
import '../dashboard.css'; // Import the shared dashboard styles

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

export default AdminMenu;