import React, { useState, useEffect, useRef } from "react";
import Navbar from "./navbar";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";

const Attendance = () => {
  let { className } = useParams();
  className = className.toLocaleUpperCase();
  const [timer, setTimer] = useState(5);
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isQrHidden, setIsQrHidden] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    let countdown;

    if (isQrVisible) {
      generateQrCode(); 

      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setIsQrHidden(true); 
            setIsRegenerating(true);
            setTimeout(() => {
              generateQrCode(); 
              setIsQrHidden(false); 
              setIsRegenerating(false); 
              setTimer(5); 
            }, 1000);

            return prev - 1;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdown); 
    };
  }, [isQrVisible]);

  const generateQrCode = () => {
    const timestamp = new Date().getTime(); 
    const qrValue = `Attendance marked at ${timestamp}`; 
    const canvas = qrCanvasRef.current;

    QRCode.toCanvas(canvas, qrValue, { width: 256 }, (error) => {
      if (error) console.error(error);
    });
  };

  const handleMarkAttendance = () => {
    setIsQrVisible(true); 
    setTimer(5); 
    setIsRegenerating(false); 
    setIsQrHidden(false); 
  };

  return (
    <>
      <Navbar title={`Attendance for ${className}`} />
      <div className="p-8 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Attendance for {className}</h1>

        <button
          onClick={handleMarkAttendance}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Mark Attendance
        </button>

        {isQrVisible && (
          <div className="mt-8">
            <div
              className={`transition-opacity duration-1000 ease-in-out ${
                isQrHidden ? "opacity-0" : "opacity-100"
              }`}
            >
              <canvas ref={qrCanvasRef} />
            </div>
            {isRegenerating && (
              <p className="mt-4 text-lg text-red-500">Regenerating QR...</p>
            )}
            {!isRegenerating && (
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
