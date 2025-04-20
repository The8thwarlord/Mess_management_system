import React, { useState } from 'react';
import './userMenu.css';

const menuData = {
  Monday: {
    special: "Ice Cream",
    breakfast: ["Poha", "Tea", "Banana"],
    lunch: ["Roti", "Dal Fry", "Aloo Gobi", "Rice"],
    dinner: ["Paneer Butter Masala", "Jeera Rice", "Salad"],
  },
  Tuesday: {
    special: "Gulab Jamun",
    breakfast: ["Upma", "Coffee", "Papaya"],
    lunch: ["Paratha", "Chole", "Cabbage Sabzi", "Rice"],
    dinner: ["Veg Pulao", "Raita", "Dal Tadka"],
  },
  Wednesday: {
    special: "Fruit Custard",
    breakfast: ["Idli", "Sambar", "Chutney"],
    lunch: ["Roti", "Rajma", "Bhindi Fry", "Rice"],
    dinner: ["Veg Biryani", "Curd", "Papad"],
  },
  Thursday: {
    special: "Kheer",
    breakfast: ["Dhokla", "Tea", "Apple"],
    lunch: ["Roti", "Mix Veg", "Dal Makhani", "Rice"],
    dinner: ["Pav Bhaji", "Salad"],
  },
  Friday: {
    special: "Jalebi",
    breakfast: ["Paratha", "Curd", "Orange"],
    lunch: ["Roti", "Chana Masala", "Baingan Bharta", "Rice"],
    dinner: ["Veg Fried Rice", "Manchurian", "Soup"],
  },
  Saturday: {
    special: "Halwa",
    breakfast: ["Sabudana Khichdi", "Tea", "Banana"],
    lunch: ["Roti", "Dal", "Aloo Matar", "Rice"],
    dinner: ["Paneer Tikka", "Naan", "Salad"],
  },
  Sunday: {
    special: "Ice Cream",
    breakfast: ["Aloo Puri", "Lassi", "Mango"],
    lunch: ["Roti", "Dal Fry", "Mixed Veg", "Rice"],
    dinner: ["Veg Pizza", "French Fries", "Juice"],
  },
};

const daysOfWeek = Object.keys(menuData);

const UserMenu = () => {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  const menu = menuData[selectedDay];

  return (
    <div className="main-content">
      <div className="header">
        <h1>Today's Mess Menu</h1>
        
      </div>
      <div className="menu-filter">
        <span>{selectedDay}</span>
        <select
          value={selectedDay}
          onChange={e => setSelectedDay(e.target.value)}
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
      <div className="special-item">
        <span>Today Menu Special: {menu.special}</span>
      </div>
      <div className="menu-cards">
        <div className="card">
          <h3>Breakfast</h3>
          <p>8a.m.-10a.m.</p>
          <ul>
            {menu.breakfast.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
        <div className="card">
          <h3>Lunch</h3>
          <p>12p.m.-2p.m.</p>
          <ul>
            {menu.lunch.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
        <div className="card">
          <h3>Dinner</h3>
          <p>7:30p.m.-9:30p.m.</p>
          <ul>
            {menu.dinner.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;