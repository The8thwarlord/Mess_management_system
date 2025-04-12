import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-btn">Login</button>
      </form>
      <p>
        Don't have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
      <p>
        Are you an admin?{" "}
        <span className="auth-link admin" onClick={() => navigate("/admin-login")}>
          Admin Login
        </span>
      </p>
    </div>
  );
};

export default Login;