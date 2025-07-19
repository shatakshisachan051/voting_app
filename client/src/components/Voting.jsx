import React, { useEffect, useState } from 'react';
import axios from '../axios';
import FaceVerification from './FaceVerification';

const Voting = () => {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [userStatus, setUserStatus] = useState({
    isProfileComplete: false,
    isVerifiedByAdmin: false
  });

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

  // Check user status
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await axios.get('/users/profile-status');
        setUserStatus(response.data);
      } catch (err) {
        console.error('Error checking user status:', err);
      }
    };

    if (userId) {
      checkUserStatus();
    }
  }, [userId]);

  // Fetch user's voting history
  const fetchUserVotes = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get("/votes/history");
      console.log("Received voting history:", response.data);
      
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

  const handleVoteClick = async (electionId, candidateName) => {
    if (!userStatus.isProfileComplete) {
      setError("Please complete your profile before voting.");
      return;
    }

    if (!userStatus.isVerifiedByAdmin) {
      setError("Your profile is pending admin verification.");
      return;
    }

    setSelectedVote({ electionId, candidateName });
    setShowFaceVerification(true);
  };

  const handleVote = async () => {
    try {
      if (isSubmitting) return;

      if (!userId) {
        setError("User ID not found. Please try logging in again.");
        return;
      }

      if (userVotes[selectedVote.electionId]) {
        setError("You have already voted in this election.");
        return;
      }

      setIsSubmitting(true);
      setError(""); 
      
      console.log("Submitting vote:", selectedVote);
      
      const response = await axios.post("/votes", { 
        electionId: selectedVote.electionId, 
        candidateName: selectedVote.candidateName 
      });

      if (response.status === 201) {
        console.log("Vote successful:", response.data);
        setUserVotes(prev => ({
          ...prev,
          [selectedVote.electionId]: true
        }));
        alert(response.data.message || "Vote submitted successfully!");
      }
    } catch (err) {
      console.error("❌ Error submitting vote:", err.response?.data);
      setError(err.response?.data?.message || "Failed to submit vote");
      await fetchUserVotes();
    } finally {
      setIsSubmitting(false);
      setShowFaceVerification(false);
      setSelectedVote(null);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      const loadInitialData = async () => {
        await fetchUserVotes();
        await fetchElections();
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

  if (!userStatus.isProfileComplete) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Complete Your Profile</h3>
        <p>Please complete your profile before accessing the voting system.</p>
        <button
          onClick={() => window.location.href = '/complete-profile'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Complete Profile
        </button>
      </div>
    );
  }

  if (!userStatus.isVerifiedByAdmin) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Profile Pending Verification</h3>
        <p>Your profile is currently under review. Please wait for admin verification before voting.</p>
      </div>
    );
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
      
      {showFaceVerification && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%'
          }}>
            <h3>Face Verification Required</h3>
            <FaceVerification
              onVerified={handleVote}
              onError={(err) => {
                setError(err);
                setShowFaceVerification(false);
              }}
              storedPhotoUrl={`/uploads/photos/${JSON.parse(localStorage.getItem("user")).photoPath}`}
            />
            <button
              onClick={() => setShowFaceVerification(false)}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
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
                          onClick={() => handleVoteClick(election._id, candidateName)}
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
