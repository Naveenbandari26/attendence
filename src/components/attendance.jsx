import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Navbar from "./navbar";

const Attendance = () => {
  const [token, setToken] = useState("");
  const [timer, setTimer] = useState(15);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const qrCanvasRef = useRef(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const user_id = localStorage.getItem("user_id");
  const batch_id = localStorage.getItem("batch_id");

  const fetchToken = async () => {
    try {
      const response = await axios.post("https://tata-virid.vercel.app/generate", {
        user_id: user_id,
        batch_id: batch_id,
      });

      if (response.data && response.data.record) {
        const newToken = response.data.record.token;
        setToken(newToken); 
        localStorage.setItem("token", newToken); 
        return newToken;
      } else {
        console.error("Token not found in response:", response);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return null;
  };

  const generateQrCode = (tokenToUse) => {
    const canvas = qrCanvasRef.current;
    if (!tokenToUse) {
      console.warn("Token is not available yet!");
      return;
    }

    QRCode.toCanvas(canvas, tokenToUse, { width: 256 }, (error) => {
      if (error) console.error(error);
    });
  };

  const refreshQrCode = async () => {
    localStorage.removeItem("token");
    const newToken = await fetchToken();
    if (newToken) {
      generateQrCode(newToken);
    }
  };

  useEffect(() => {
    let countdown;
    if (isQrVisible) {
      refreshQrCode(); 

      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setIsRegenerating(true);

            setTimeout(async () => {
              await refreshQrCode(); 
              setIsRegenerating(false);
              setTimer(15); 
            }, 1000);

            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown); 
    };
  }, [isQrVisible]);

  const handleToggleAttendance = async () => {
    setIsQrVisible((prev) => !prev); 
    if (!isQrVisible) {
      setTimer(15); 
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard"); // Navigate to the dashboard page
  };

  return (
    <>
      <Navbar title={"Attendance"} />
      <button
          onClick={goToDashboard}
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Go to Dashboard
        </button>
      <div className="p-10 flex flex-col justify-center items-center">
        <button
          onClick={handleToggleAttendance}
          className="bg-blue-1000 text-gray-200 py-2 px-4 rounded-md bg-blue-600"
        >
          {isQrVisible ? "Stop Attendance" : "Mark Attendance"}
        </button>

        {isQrVisible && (
          <div className="mt-10">
            <div>
              <canvas ref={qrCanvasRef} />
            </div>
            {isRegenerating && (
              <p className="mt-4 text-lg text-red-1000">Regenerating QR...</p>
            )}
            {!isRegenerating && (
              <p className="mt-4 text-lg text-red-1000">
                QR code will refresh in {timer} seconds  
              </p>
            )}
          </div>
        )}

        {/* Button to navigate to Dashboard */}
        
      </div>
    </>
  );
};

export default Attendance;
