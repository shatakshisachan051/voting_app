import axios from "axios";
import React, { useEffect, useState } from "react";

const Voting = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/elections", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Check if backend sent a refreshed token
      const refreshedToken = response.headers["x-refreshed-token"];
      if (refreshedToken) {
        localStorage.setItem("token", refreshedToken);
      }

      setElections(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch elections");
    }
  };

  const handleVote = async (electionId, candidateId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/votes",
        { electionId, candidateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || "Vote submitted successfully!");
      fetchElections(); // Optionally refresh elections
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit vote");
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div>
      <h2>Elections</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {elections.map((election) => (
          <li key={election.id || election._id}>
            <h3>{election.name || election.title}</h3>
            <p>Status: {election.status}</p>
            <ul>
              {(election.candidates || []).map((candidate, idx) => (
                <li key={candidate._id || idx}>
                  {candidate.name || candidate}
                  <button onClick={() => handleVote(election.id || election._id, candidate._id || candidate)}>
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voting;
