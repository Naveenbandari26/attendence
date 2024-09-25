import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";
import axios from "axios";
import ClassNavbar from "./classNavbar";

const Attendance = () => {
  let { className } = useParams();
  className = className.toLocaleUpperCase();
  const [token, setToken] = useState("");
  const [timer, setTimer] = useState(5);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const qrCanvasRef = useRef(null);

  const user_id = localStorage.getItem("user_id");
  const batch_id = localStorage.getItem("batch_id");

//this function fetch the tokens from the /generate api
  const fetchToken = async () => {
    try {
      const response = await axios.post("https://tata-virid.vercel.app/generate", {
        user_id: user_id,
        batch_id: batch_id,
      });

      if (response.data && response.data.record) {
        const newToken = response.data.record.token;
        setToken(newToken); //assigning the token value to token variable
        localStorage.setItem("token", token); // making the token to get stored in the local Storage.
        
        return newToken;
      } else {
        console.error("Token not found in response:", response);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
    return null;
  };

  // this function generates the Qr with the token attached to it.
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

  // this makes the refreshment of the token along with qr.
  const refreshQrCode = async () => {
    // this removes the old token.
    localStorage.removeItem("token");

    // generating the new qr and token
    const newToken = await fetchToken();
    if (newToken) {
      generateQrCode(newToken);
    }
  };

  useEffect(() => {
    let countdown;
    if (isQrVisible) {
      refreshQrCode(); //1st qr appearence.

      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setIsRegenerating(true);

            // thsi helps to regenerate the qr every 5 sec.
            setTimeout(async () => {
              await refreshQrCode(); //this fetched the new token value for the qr
              setIsRegenerating(false);
              setTimer(5); // making sure the timer will be 5 sec.
            }, 1000); // time between the old and new qr

            return 5; // Reset countdown to 5 seconds after regeneration
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown); // Clear the interval on component unmount
    };
  }, [isQrVisible]);

  const handleToggleAttendance = async () => {
    setIsQrVisible((prev) => !prev); // Toggle visibility of the QR code
    if (!isQrVisible) {
      setTimer(5); // Start the countdown if QR code is shown
    }
  };

  return (
    <>
      <ClassNavbar title={`Attendance for ${className}`}/>
      <div className="p-8 flex flex-col justify-center items-center">
        {/* {this following button make sure to act as the switch to start and stop the qr marking} */}
        <button
          onClick={handleToggleAttendance}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {isQrVisible ? "Stop Attendance" : "Mark Attendance"}
        </button>

        {isQrVisible && (
          <div className="mt-8">
            <div>
              <canvas ref={qrCanvasRef} />
            </div>
            {isRegenerating && (
              <p className="mt-4 text-lg text-red-500">Regenerating QR...</p>
            )}
            {!isRegenerating && (
              // this make sure to make a sentence that helps to user to get the idea that qr is refreshed for every 5 sec.
              <p className="mt-4 text-lg text-red-500">
                QR code will refresh in {timer} seconds  
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Attendance;
