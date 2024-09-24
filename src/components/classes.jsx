import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";

const Classes = () => {
  return (
    <>
      <Navbar title={"Classes"} />
      <div className="p-8">
        <h1 className="text-2xl text-gray-800 font-bold mb-4">Classes</h1>
        <div className="space-y-4 w-60">
          <Link
            to="/attendance/vihaan"
            className="block p-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Vihaan
          </Link>
          <Link
            to="/attendance/dsa"
            className="block p-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            DSA
          </Link>
        </div>
      </div>
    </>
  );
};

export default Classes;
