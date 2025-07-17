import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    voterId: "",
    role: "voter",
    adminCode: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === "admin") {
      if (formData.adminCode !== "admin123") {
        setError("Invalid admin code.");
        return;
      }
    }
    try {
      const payload = { ...formData };
      if (formData.role === "admin") delete payload.voterId;
      if (formData.role === "voter") delete payload.adminCode;
      const res = await axios.post("/api/auth/register", payload); 
      alert(res.data.message || "Registration successful!");
      setFormData({ name: "", email: "", password: "", voterId: "", role: "voter", adminCode: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="username"
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        {formData.role === "voter" && (
          <input
            type="text"
            name="voterId"
            placeholder="Voter ID"
            value={formData.voterId}
            onChange={handleChange}
            required
            autoComplete="off"
            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
          />
        )}
        {formData.role === "admin" && (
          <input
            type="password"
            name="adminCode"
            placeholder="Admin Code"
            value={formData.adminCode}
            onChange={handleChange}
            required
            autoComplete="off"
            style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
          />
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px 20px" }}>Register</button>
      </form>
    </div>
  );
};

export default Register;
