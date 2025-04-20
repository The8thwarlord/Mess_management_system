import React, { useEffect, useState } from 'react';
import './profile.css';

const API_URL = "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    rollNo: '',
    mobileNo: '',
    roomNo: '',
    yearOfStudy: '',
    branch: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        name: storedUser.name || '',
        email: storedUser.email || '',
        rollNo: storedUser.rollNo || '',
        mobileNo: storedUser.mobileNo || '',
        roomNo: storedUser.roomNo || '',
        yearOfStudy: storedUser.yearOfStudy || '',
        branch: storedUser.branch || '',
        _id: storedUser._id,
      });
    }
  }, []);

  // Handle input changes during editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save changes to backend and localStorage
  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        alert("User not found in localStorage.");
        return;
      }
      const response = await fetch(`${API_URL}/user/${storedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (error) {
      alert("Server error. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="main-content">
      <div className="header">
        <h1>Profile</h1>
        <button className="logout-btn">Log Out →</button>
      </div>
      <div className="profile-container">
        <h2>User Profile</h2>
        {isEditing ? (
          <div className="profile-form">
            <div className="form-group">
              <label><strong>Name:</strong></label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label><strong>Email:</strong></label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="form-input"
                disabled // Email is typically not editable for security reasons
              />
            </div>
            <div className="form-group">
              <label><strong>Roll No:</strong></label>
              <input
                type="text"
                name="rollNo"
                value={user.rollNo}
                onChange={handleInputChange}
                className="form-input"
                disabled // Roll number is typically fixed
              />
            </div>
            <div className="form-group">
              <label><strong>Mobile No:</strong></label>
              <input
                type="tel"
                name="mobileNo"
                value={user.mobileNo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter mobile number"
              />
            </div>
            <div className="form-group">
              <label><strong>Room No:</strong></label>
              <input
                type="text"
                name="roomNo"
                value={user.roomNo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter room number"
              />
            </div>
            <div className="form-group">
              <label><strong>Year of Study:</strong></label>
              <select
                name="yearOfStudy"
                value={user.yearOfStudy}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div className="form-group">
              <label><strong>Branch of Engineering:</strong></label>
              <select
                name="branch"
                value={user.branch}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select branch</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Electronics">Electronics</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
            <div className="form-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={toggleEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Roll No:</strong> {user.rollNo}</p>
            <p><strong>Mobile No:</strong> {user.mobileNo || 'Not provided'}</p>
            <p><strong>Room No:</strong> {user.roomNo || 'Not provided'}</p>
            <p><strong>Year of Study:</strong> {user.yearOfStudy || 'Not provided'}</p>
            <p><strong>Branch of Engineering:</strong> {user.branch || 'Not provided'}</p>
            <button onClick={toggleEdit} className="edit-btn">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;