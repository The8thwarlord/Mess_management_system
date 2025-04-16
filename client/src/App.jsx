import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./adminDashboard";

import AdminScanner from "./AdminScanner";
import AttendanceViewer from "./AttendanceViewer";
import QrScanner from "./components/QRScanner";  // Import QRScanner component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/scanner" element={<AdminScanner />} />
        <Route path="/manager/attendance" element={<AttendanceViewer />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        
        {/* Add the QRScanner route */}
        <Route path="/qr-scanner" element={<QrScanner />} />{/* New route for the QR Scanner */}
      </Routes>
    </Router>
  );
};

export default App;
