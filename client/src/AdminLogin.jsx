import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Static Admin Credentials
  const adminEmail = "admin@mess.com";
  const adminPassword = "admin123";

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");

    console.log("Admin Login Attempt:", admin);

    // Check if entered credentials match static values
    if (admin.email === adminEmail && admin.password === adminPassword) {
      alert("Admin login successful!");
      navigate("/admin-dashboard"); // Redirect after login
    } else {
      setError("Invalid admin credentia ls!");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Admin Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAdminLogin} className="auth-form">
        <input
          type="email"
          placeholder="Admin Email"
          value={admin.email}
          onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={admin.password}
          onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn">Login as Admin</button>
      </form>
      <p>
        Not an admin?{" "}
        <span className="auth-link" onClick={() => navigate("/login")}>
          User Login
        </span>
      </p>
    </div>
  );
};

export default AdminLogin;
