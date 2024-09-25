import React from "react";
import { useNavigate } from "react-router-dom";

const ClassNavbar = ({ title }) => {
  const navigate = useNavigate();

  const handleClick = async () => {

    navigate(-1);
  };

  return (
    <nav className="bg-[#D6E6F2] p-4 text-white flex items-center">
      <button 
        onClick={handleClick} 
        className="bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-700 mr-4"
      >
        back
      </button>
      <h1 className="text-2xl text-gray-800 font-semibold">{title}</h1>
    </nav>
  );
};

export default ClassNavbar;
