import React, { useState } from "react";
import axios from "../axios";

const EditProfile = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(`/users/update/${user.id}`, { name, email });
      alert(res.data.message);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await axios.put(`/users/change-password/${user.id}`, {
        currentPassword,
        newPassword,
      });
      alert(res.data.message);
    } catch (err) {
      console.error("❌ Error changing password:", err);
    }
  };

  return (
    <div>
      <h2>👤 Edit Profile</h2>
      <div>
        <label>Name: </label>
        <input value={name} onChange={(e) => setName(e.target.value)} /><br />
        <label>Email: </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <button onClick={handleProfileUpdate}>Update Profile</button>
      </div>
      <h3>🔑 Change Password</h3>
      <div>
        <label>Current Password: </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        /><br />
        <label>New Password: </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        /><br />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default EditProfile;
