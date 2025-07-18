import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password, role }
      );

      console.log("✅ Login response:", response.data);
      
      // Ensure user object has _id
      if (!response.data.user._id) {
        throw new Error("Server response missing user ID");
      }

      // Store complete user object
      const userData = response.data.user;
      console.log("📝 Storing user data:", userData);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Verify stored data
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("🔍 Verified stored user data:", storedUser);
      
      setIsLoggedIn(true);
      setUser(userData);
      
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        {error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
