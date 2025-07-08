import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios"; // ✅ Import our axios instance

const Login = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("📥 Sending login request...");

    try {
      const response = await axios.post("/auth/login", formData); // ✅ Backend URL simplified
      console.log("✅ Login response:", response.data);

      setIsLoggedIn(true);
      setUser(response.data.user); // Save user info
      localStorage.setItem("token", response.data.token); // Optional: Save token

      navigate("/profile"); // Redirect to profile
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
