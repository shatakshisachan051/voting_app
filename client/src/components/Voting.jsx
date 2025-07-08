import React, { useEffect, useState } from "react";
import axios from "../axios"; // ✅ Use axios instance
import { useNavigate } from "react-router-dom";

const Voting = ({ user, isLoggedIn }) => {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }

    // Fetch elections
    const fetchElections = async () => {
      try {
        const response = await axios.get("/elections");
        console.log("📥 Elections fetched:", response.data);
        setElections(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching elections:", error);
        alert("Failed to load elections.");
        setLoading(false);
      }
    };

    fetchElections();
  }, [isLoggedIn, user, navigate]);

  const handleVote = async (electionId, candidate) => {
    try {
      const response = await axios.post("/votes", {
        userId: user.id,
        electionId,
        candidate,
      });
      console.log("✅ Vote submitted:", response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("❌ Error voting:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Failed to submit vote. Try again."
      );
    }
  };

  if (loading) return <p>Loading elections...</p>;

  return (
    <div>
      <h2>🗳️ Elections</h2>
      {elections.length === 0 ? (
        <p>No elections available.</p>
      ) : (
        elections.map((election) => (
          <div
            key={election._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{election.title}</h3>
            <p>
              🗓️ {new Date(election.startDate).toLocaleDateString()} -{" "}
              {new Date(election.endDate).toLocaleDateString()}
            </p>
            <h4>Candidates:</h4>
            <ul>
              {election.candidates.map((candidate, idx) => (
                <li key={idx}>
                  {candidate}{" "}
                  <button
                    onClick={() => handleVote(election._id, candidate)}
                    style={{ marginLeft: "10px" }}
                  >
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Voting;
