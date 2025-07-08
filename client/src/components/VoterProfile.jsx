import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VoterProfile = ({ isLoggedIn, user, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      console.warn("❌ Not logged in. Redirecting to /login...");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null; // or a loader
  }

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>You are successfully logged in!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default VoterProfile;
