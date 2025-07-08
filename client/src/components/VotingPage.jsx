import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.log("❌ Not logged in. Redirecting to /login");
      navigate("/login");
    } else {
      console.log("✅ User logged in. Fetching candidates...");
      fetchCandidates();
    }
  }, [navigate]);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("/api/candidates");
      console.log("📥 Candidates fetched:", res.data);
      setCandidates(res.data);
    } catch (err) {
      console.error("❌ Error fetching candidates:", err);
    }
  };

  const handleVote = async (candidateId) => {
    try {
      console.log(`📥 Voting for candidate: ${candidateId}`);
      await axios.post(`/api/vote/${candidateId}`);
      console.log("✅ Vote submitted successfully");
      setVoted(true);
    } catch (err) {
      console.error("❌ Error submitting vote:", err);
    }
  };

  if (voted) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>✅ Thank you for voting!</h2>
        <p>Your vote has been recorded.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vote for Your Candidate</h2>
      {candidates.length === 0 ? (
        <p>Loading candidates...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {candidates.map((candidate) => (
            <li
              key={candidate._id}
              style={{
                marginBottom: "15px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{candidate.name}</h3>
              <p>Party: {candidate.party}</p>
              <button
                onClick={() => handleVote(candidate._id)}
                style={{
                  padding: "8px 12px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VotingPage;
