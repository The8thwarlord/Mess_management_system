import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import './QrScanner.css';

const QrScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);
  const html5QrCodeScanner = useRef(null);

  const API_URL = window.location.origin.includes("loca.lt")
    ? "https://your-backend-subdomain.loca.lt" // Replace with your actual localtunnel URL
    : "http://localhost:5000"; // Replace with your local IP address

  useEffect(() => {
    if (scanning) {
      html5QrCodeScanner.current = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
      });

      // ...existing code...
      html5QrCodeScanner.current.render(
        async (decodedText) => {
          console.log("QR Code scanned:", decodedText);
          setStatus("QR Code scanned. Marking attendance...");

          try {
            // Try to parse the QR code as JSON
            let userId = decodedText;
            try {
              const parsed = JSON.parse(decodedText);
              userId = parsed.userId || decodedText;
            } catch (e) {
              // Not JSON, use as is
            }

            const response = await fetch(`${API_URL}/mark-attendance`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            });

            console.log("Response received:", response);
            const responseData = await response.json();

            if (response.ok) {
              setStatus(`✅ Attendance marked for ${userId}`);
            } else {
              setStatus(`❌ Error: ${responseData.error || "Failed to mark attendance"}`);
              console.error("Backend error:", responseData.error);
            }
          } catch (error) {
            setStatus("❌ Error marking attendance");
            console.error("Error making attendance request:", error);
          }

          html5QrCodeScanner.current.clear();
          setScanning(false);
        },
        (errorMessage) => {
          console.warn("QR scanning error:", errorMessage);
        }
      );
      
    }

    return () => {
      if (html5QrCodeScanner.current) {
        html5QrCodeScanner.current.clear();
      }
    };
  }, [scanning]);

  const handleStartScan = () => {
    setError(null);
    setStatus("Starting scan...");
    setScanning(true);
  };

  const handleStopScan = () => {
    if (html5QrCodeScanner.current) {
      html5QrCodeScanner.current.clear();
      setScanning(false);
    }
  };

  return (
    <div className="qr-scanner-container">
      <h1 className="qr-scanner-title">QR Scanner</h1>
      <div id="reader" className="qr-scanner-reader"></div>
      {status && <div className="status-message">{status}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="button-container">
        <button className="scan-button" onClick={handleStartScan} disabled={scanning}>
          Start Scan
        </button>
        <button className="stop-button" onClick={handleStopScan} disabled={!scanning}>
          Stop Scan
        </button>
      </div>
    </div>
  );
};

export default QrScanner;