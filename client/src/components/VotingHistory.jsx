import axios from "../axios";
import React, { useEffect, useState } from "react";

const VotingHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/votes/history");
      console.log("Received voting history:", response.data);
      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching voting history:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch voting history");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading voting history...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Voting History</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
          <button 
            onClick={() => setError("")} 
            style={{ 
              marginLeft: '10px', 
              background: 'none', 
              border: 'none', 
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </div>
      )}
      {history.length === 0 ? (
        <p>No voting history found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((vote) => (
            <li 
              key={vote.id}
              style={{
                padding: '15px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{vote.electionTitle}</div>
              <div>Voted for: {vote.candidateName}</div>
              <div style={{ color: '#666', fontSize: '0.9em' }}>
                {new Date(vote.votedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VotingHistory;
