import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📤 Sending login data:", formData);
    try {
      const res = await axios.post("/api/auth/login", formData);
      console.log("✅ Login response:", res.data);
      alert(res.data.message || "Login successful!");
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
