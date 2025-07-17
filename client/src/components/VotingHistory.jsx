import axios from "axios";
import React, { useEffect, useState } from "react";

const VotingHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/votes/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If backend sends a refreshed token
      const refreshedToken = response.headers["x-refreshed-token"];
      if (refreshedToken) {
        localStorage.setItem("token", refreshedToken);
      }

      setHistory(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch voting history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Voting History</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {history.map((vote, index) => (
          <li key={index}>
            {vote.electionName} - {vote.candidateName} - {new Date(vote.votedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingHistory;
