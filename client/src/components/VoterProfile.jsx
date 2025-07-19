import React, { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const VoterProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    address: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      let currentUser = null;
      
      if (user?._id) {
        currentUser = user;
      } else if (storedUser) {
        try {
          currentUser = JSON.parse(storedUser);
        } catch (e) {
          console.error("❌ Error parsing stored user:", e);
          localStorage.removeItem("user");
        }
      }

      if (currentUser?._id) {
        setUserData(currentUser);
        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          age: currentUser.age || "",
          address: currentUser.address || ""
        });
        
        // Only redirect if profile is not complete
        if (currentUser.role === "voter" && !currentUser.isProfileComplete) {
          navigate("/complete-profile");
          return;
        }
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
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      if (!userData?._id) {
        throw new Error("User ID is missing");
      }

      const response = await axios.put(
        `/users/update/${userData._id}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      // Update local storage and state with new user data
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserData(updatedUser);
      
      // Update parent component's user state
      if (setUser) {
        setUser(updatedUser);
      }
      
      setEditing(false);
      setError(null);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError(err.response?.data?.message || err.message || "Failed to update profile");
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>👤 Voter Profile</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}

      {!userData.isVerifiedByAdmin && userData.isProfileComplete && (
        <div style={{ backgroundColor: '#fff3e0', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          ⏳ Your profile is pending admin verification. You can still edit your details while waiting.
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Role:</strong> {userData.role}</p>
        {userData.voterId && <p><strong>Voter ID:</strong> {userData.voterId}</p>}
        <p><strong>Profile Status:</strong> {userData.isVerifiedByAdmin ? '✅ Verified' : '⏳ Pending Verification'}</p>
      </div>

      {editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="18"
              style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
            />
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              💾 Save Changes
            </button>
            <button 
              onClick={() => {
                setEditing(false);
                setFormData({
                  name: userData.name || "",
                  email: userData.email || "",
                  age: userData.age || "",
                  address: userData.address || ""
                });
                setError(null);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Age:</strong> {userData.age}</p>
          <p><strong>Address:</strong> {userData.address}</p>
          
          <button 
            onClick={() => setEditing(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              width: 'fit-content'
            }}
          >
            ✏️ Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default VoterProfile;
