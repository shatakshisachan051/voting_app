import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // For showing feedback

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      console.log("📥 Sending login request...");
      const res = await axios.post("/api/auth/login", { email, password });
      console.log("✅ Login response:", res.data);

      if (res.data && res.data.user) {
        setUser(res.data.user);
        setMessage("✅ Login successful!");
        navigate("/profile"); // Redirect to profile
      } else {
        setMessage("❌ Unexpected response");
      }
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setMessage("❌ Invalid credentials. Try again.");
      } else {
        setMessage("❌ Server error. Please try later.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "10px", color: message.startsWith("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;
