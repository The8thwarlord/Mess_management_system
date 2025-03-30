import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-text">Mess Management System</span>
        </div>
        <div className="nav-content">
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")} className="auth-btn">Login</button>
            <button onClick={() => navigate("/register")} className="auth-btn">Register</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title"></h1>
          <p className="hero-subtitle"></p>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="about-content">
          <h2 className="about-title">JoshiMess</h2>
          <p className="about-text">
              Joshi Mess is a student-run mess that serves delicious and nutritious meals to students at affordable prices.
              We understand the importance of a balanced diet for students, and we strive to provide a variety of dishes
              that cater to different tastes and preferences.

              Our menu includes a mix of traditional and modern dishes, prepared with fresh ingredients and cooked to perfection.
              We also offer special meals for students with dietary restrictions, ensuring that everyone can enjoy a satisfying meal.
  
          </p>
          <p className="about-text">
            Whether you're checking the daily specials, scheduling your meals, or keeping track of your mess bill,
            MessMate provides an intuitive platform for all your needs. Say goodbye to the hassle of manual tracking!
          </p>
          <p className="about-footer">Created for college students, by college students.</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">JoshiMess</span>
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact Us</a>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
          </div>
        </div>
        <p className="footer-copyright">&copy; 2025 MessMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;