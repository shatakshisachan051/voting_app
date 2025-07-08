import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VoterProfile = ({ user, isLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    age: "",
  });

  console.log("🔄 VoterProfile render: isLoggedIn =", isLoggedIn);
  console.log("👤 Current user:", user);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      console.log("❌ Not logged in. Redirecting to /login...");
      navigate("/login");
    } else {
      // Initialize form with user data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        age: user.age || "",
      });
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Use user.id (not user._id)
      console.log("💾 Saving profile for userId:", user?.id);

      const response = await axios.put(
        `/api/users/${user?.id}`,
        formData
      );
      console.log("✅ Profile updated:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error.response || error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>Voter Profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
          />
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default VoterProfile;
