import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function VoterProfile({ user, isLoggedIn }) {
  const navigate = useNavigate();

  console.log("🔄 VoterProfile render: isLoggedIn =", isLoggedIn);
  console.log("👤 Current user:", user);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("❌ Not logged in. Redirecting to /login...");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Voter Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Voter ID:</strong> {user.voterId}</p>
    </div>
  );
}

export default VoterProfile;
