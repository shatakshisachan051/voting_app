import React, { useState, useEffect } from "react";
import axios from "../axios";

const VoterProfile = ({ user, setUser }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      // Get user data from props or localStorage
      const storedUser = localStorage.getItem("user");
      console.log("📱 Component mounted. Props user:", user);
      console.log("💾 Stored user:", storedUser);
      
      let currentUser = null;
      
      if (user?._id) {
        console.log("✅ Using props user");
        currentUser = user;
      } else if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
          console.log("✅ Using localStorage user");
        } catch (e) {
          console.error("❌ Error parsing stored user:", e);
          localStorage.removeItem("user"); // Clear invalid data
        }
      }

      if (currentUser?._id) {
        console.log("🔄 Setting user data:", currentUser);
        setUserData(currentUser);
        setName(currentUser.name || "");
        setEmail(currentUser.email || "");
      } else {
        console.error("❌ No valid user data found");
        setError("No valid user data found. Please log in again.");
      }
    } catch (err) {
      console.error("❌ Error in useEffect:", err);
      setError("Error loading user data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Token:", token ? "Present" : "Missing");
      
      if (!userData?._id) {
        console.error("❌ No user ID found in:", userData);
        throw new Error("User ID is missing");
      }

      console.log("🔄 Updating profile for user:", userData._id);
      
      const response = await axios.put(
        `/users/update/${userData._id}`,
        { name, email },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("✅ Profile updated:", response.data);
      
      // Update local storage and state with new user data
      const updatedUser = { ...userData, name, email };
      console.log("💾 Saving updated user:", updatedUser);
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      // Update parent component's user state if setUser exists
      if (setUser) {
        setUser(updatedUser);
      }
      
      setEditing(false);
      setError(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", {
        error: err.message,
        response: err.response?.data,
        userData: userData
      });
      setError(err.response?.data?.message || err.message || "Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData?._id) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <h3>⚠️ No User Data Available</h3>
        <p>Please try logging in again.</p>
        {error && <p>Error: {error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>👤 Voter Profile</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Role:</strong> {userData.role}</p>
        {userData.voterId && <p><strong>Voter ID:</strong> {userData.voterId}</p>}
      </div>

      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '5px', width: '200px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '5px', width: '200px' }}
            />
          </div>

          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={handleSave}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >
              💾 Save
            </button>
            <button 
              onClick={() => {
                setEditing(false);
                setName(userData.name);
                setEmail(userData.email);
                setError(null);
              }}
              style={{ padding: '5px 10px' }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          {userData.role === "voter" && (
            <button 
              onClick={() => setEditing(true)}
              style={{ padding: '5px 10px', marginTop: '10px' }}
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterProfile;
