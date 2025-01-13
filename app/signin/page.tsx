"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for app directory

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form refresh
    try {
      const response = await axios.post("http://127.0.0.1:8000/sign_in", {
        phone_number: phoneNumber,
        password: password,
      });

      // Save tokens (if needed)
      const { access_token } = response.data.result;
      localStorage.setItem("access_token", access_token);

      // Redirect to the dashboard
      setResponseMessage("Login successful!");
      router.push("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      setResponseMessage(
        `Error: ${error.response?.data?.detail || "Something went wrong"}`
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Login;
