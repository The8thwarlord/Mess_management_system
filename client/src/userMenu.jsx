// userMenu.jsx
import React from 'react';
import './userMenu.css';

const UserMenu = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Today's Mess Menu</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="menu-filter">
        <span>Monday</span>
        <select>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
          <option>Sunday</option>
        </select>
      </div>
      <div className="special-item">
        <span>Today Menu Special: !Ice Cream</span>
      </div>
      <div className="menu-cards">
        <div className="card">
          <h3>Breakfast</h3>
          <p>8a.m.-10a.m.</p>
          <ul>
            <li>BATAKA POHA</li>
            <li>COFFEE</li>
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
        <div className="card">
          <h3>Lunch</h3>
          <p>12p.m.-2p.m.</p>
          <ul>
            <li>ROTI</li>
            <li>DAL BHAT</li>
            <li>CHHOLE CHANA</li>
            <li>ALOO PALAK</li>
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
        <div className="card">
          <h3>Dinner</h3>
          <p>7:30p.m.-9:30p.m.</p>
          <ul>
            <li>PANEER</li>
            <li>ROTI</li>
            <li>JEERA RICE</li>
          </ul>
          <p className="note">* Please Follow all rules of mess and Enjoy Your Food</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;