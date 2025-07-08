import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const VoterProfile = ({ user, isLoggedIn }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  console.log("🔄 VoterProfile render: isLoggedIn =", isLoggedIn);
  console.log("👤 Current user:", user);

  useEffect(() => {
    if (!isLoggedIn) {
      console.error("❌ Not logged in. Redirecting to /login...");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/users/${user.id}`, formData);
      console.log("✅ Profile updated:", response.data);
      alert("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>🎉 Welcome, {user?.name}</h2>
      <p>📧 Email: {user?.email}</p>
      <p>🆔 User ID: {user?.id}</p>

      {editing ? (
        <div>
          <h3>✏️ Edit Profile</h3>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <br />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={() => setEditing(false)}>❌ Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)}>✏️ Edit Profile</button>
      )}
    </div>
  );
};

export default VoterProfile;
