import React, { useState } from "react";
import axios from "../axios";

const VoterProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = async () => {
    try {
      const response = await axios.put(`/users/${user.id}`, { name, email });
      console.log("✅ Profile updated:", response.data);
      setUser((prev) => ({ ...prev, name, email }));
      setEditing(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>👤 Voter Profile</h2>
      <p><strong>Role:</strong> {user.role}</p>
      {editing ? (
        <>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <button onClick={handleSave}>💾 Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {user.role === "voter" && (
            <button onClick={() => setEditing(true)}>✏️ Edit Profile</button>
          )}
        </>
      )}
    </div>
  );
};

export default VoterProfile;
