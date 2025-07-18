import axios from "../axios";
import React, { useEffect, useState } from "react";

const Voting = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate election status based on dates
  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);
    
    if (now < startDate) return "upcoming";
    if (now > endDate) return "completed";
    return "active";
  };

  // Get user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData._id) {
      setUserId(userData._id);
    }
  }, []);

  // Fetch user's voting history
  const fetchUserVotes = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get("/votes/history");
      console.log("Received voting history:", response.data);
      
      // Create a map of election IDs that user has voted in
      const votedElections = {};
      response.data.forEach(vote => {
        if (vote.election) {
          votedElections[vote.election] = true;
        }
      });
      
      console.log("Updated voting map:", votedElections);
      setUserVotes(votedElections);
    } catch (err) {
      console.error("❌ Error fetching voting history:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else {
        setError("Failed to fetch voting history. Please try refreshing the page.");
      }
    }
  };

  const fetchElections = async () => {
    try {
      const response = await axios.get("/elections");
      setElections(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch elections");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (electionId, candidateName) => {
    try {
      if (isSubmitting) {
        return; // Prevent multiple submissions
      }

      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      // Check if user has already voted in this election
      if (userVotes[electionId]) {
        setError("You have already voted in this election.");
        return;
      }

      setIsSubmitting(true);
      setError(""); // Clear any previous errors
      
      console.log("Submitting vote:", { electionId, candidateName });
      
      const response = await axios.post("/votes", { 
        electionId, 
        candidateName 
      });

      // Only update local state if vote was successful
      if (response.status === 201) {
        console.log("Vote successful:", response.data);
        
        // Update the voting history immediately
        setUserVotes(prev => ({
          ...prev,
          [electionId]: true
        }));
        
        alert(response.data.message || "Vote submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Error submitting vote:", err.response?.data);
      setError(err.response?.data?.message || "Failed to submit vote");
      
      // Refresh voting history to ensure consistency
      await fetchUserVotes();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      const loadInitialData = async () => {
        await fetchUserVotes(); // First get voting history
        await fetchElections(); // Then get elections
      };
      loadInitialData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading elections...</div>;
  }

  if (!userId) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: User data not found. Please log in again.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Elections</h2>
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
      
      {elections.length === 0 ? (
        <p>No elections available at the moment.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {elections.map((election) => {
            const status = getElectionStatus(election);
            const hasVoted = Boolean(userVotes[election._id]);
            
            return (
              <div 
                key={election._id}
                style={{ 
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: hasVoted ? '#f5f5f5' : 'white'
                }}
              >
                <h3 style={{ marginTop: 0 }}>{election.title}</h3>
                <p style={{ 
                  color: status === 'active' ? 'green' : status === 'upcoming' ? 'orange' : 'red',
                  fontWeight: 'bold'
                }}>
                  Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                </p>
                
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                  <div>Start: {new Date(election.startDate).toLocaleDateString()}</div>
                  <div>End: {new Date(election.endDate).toLocaleDateString()}</div>
                </div>
                
                {hasVoted ? (
                  <div style={{ color: 'blue', marginBottom: '10px' }}>
                    ✓ You have already voted in this election
                  </div>
                ) : null}
                
                <div style={{ marginTop: '10px' }}>
                  <h4>Candidates:</h4>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    {(election.candidates || []).map((candidateName, index) => (
                      <div 
                        key={`${election._id}-candidate-${index}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <span>{candidateName}</span>
                        <button 
                          onClick={() => handleVote(election._id, candidateName)}
                          disabled={hasVoted || status !== "active" || isSubmitting}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: hasVoted ? '#ccc' : status !== 'active' ? '#999' : isSubmitting ? '#666' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: hasVoted || status !== 'active' || isSubmitting ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isSubmitting ? 'Submitting...' : 
                           hasVoted ? 'Already Voted' : 
                           status !== 'active' ? (status === 'upcoming' ? 'Not Started' : 'Ended') : 
                           'Vote'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Voting;
