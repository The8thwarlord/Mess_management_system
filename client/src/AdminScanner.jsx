import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import "./dashboard.css";

const AdminScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [message, setMessage] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);

      try {
        const parsedData = JSON.parse(data); // Parse the QR code data
        const { userId, date } = parsedData;

        // Send a request to mark attendance
        const res = await fetch("http://localhost:5000/mark-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, date }),
        });

        const response = await res.json();
        if (res.ok) {
          setMessage("Attendance marked successfully!");
        } else {
          setMessage(response.error || "Failed to mark attendance.");
        }
      } catch (error) {
        console.error("Error processing QR code:", error);
        setMessage("Invalid QR code.");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Code Scan Error:", err);
    setMessage("Error scanning QR code. Please try again.");
  };

  return (
    <div className="scanner-container">
      <h1>Scan QR Code</h1>
      <p>Scan the QR code to mark attendance:</p>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
      />
      {scanResult && <p className="scan-result">Scanned Data: {scanResult}</p>}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminScanner;