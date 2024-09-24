import React, { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import Logo from '../ace_logo.png';

const Login = () => {
  const [user_id, setuser_id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const navigate=useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const API_URL = "https://tata-virid.vercel.app/auth/login";
    const loginData = { user_id, password };

    try {
      const response = await axios.post(API_URL, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("API Response:", response);

      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("user_id", data.user.user_id);
        localStorage.setItem("batch_id", data.user.batch_id);
          setSuccessMessage("Login successful!");
          navigate("/classes");
          console.log("Login successful!");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response) {
        console.log("Error Response:", error.response);
        setError(error.response.data?.message || "Login failed !");
      } else {
        setError("Unexpected Error!!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#D6E6F2]">
      <img src={Logo} alt="" className="w-[250px]" />
      <br />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              value={user_id}
              onChange={(e) => setuser_id(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
