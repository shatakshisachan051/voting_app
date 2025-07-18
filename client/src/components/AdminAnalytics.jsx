import React, { useEffect, useState } from 'react';
import axios from '../axios';

const AdminAnalytics = ({ user }) => {
  console.log("🔄 AdminAnalytics component rendered", { user });
  const [analytics, setAnalytics] = useState({
    totalVotes: 0,
    activeElections: 0,
    completedElections: 0,
    voterParticipation: 0,
    totalElections: 0,
    totalVoters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔄 AdminAnalytics useEffect triggered");
    const fetchAnalytics = async () => {
      try {
        // Fetch elections stats (includes vote counts and participation)
        const statsRes = await axios.get("/elections/stats");
        console.log("📊 Elections stats received:", statsRes.data);

        setAnalytics({
          totalVotes: statsRes.data.totalVotes || 0,
          activeElections: statsRes.data.active || 0,
          completedElections: statsRes.data.completed || 0,
          voterParticipation: statsRes.data.participation || 0,
          totalElections: statsRes.data.totalElections || 0,
          totalVoters: statsRes.data.totalVoters || 0,
        });
        console.log("✅ Analytics state updated successfully");
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch analytics:", {
          error: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || "Failed to load analytics");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    console.log("⌛ Loading analytics...");
    return <div>Loading analytics...</div>;
  }

  if (error) {
    console.log("❌ Rendering error state:", error);
    return <div>Error: {error}</div>;
  }

  console.log("📊 Rendering analytics dashboard with data:", analytics);
  return (
    <div>
      <h2>📈 Voting Analytics Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', padding: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h3>Total Votes Cast</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{analytics.totalVotes}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Out of {analytics.totalVoters} registered voters</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h3>Active Elections</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{analytics.activeElections}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Out of {analytics.totalElections} total elections</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h3>Completed Elections</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{analytics.completedElections}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Out of {analytics.totalElections} total elections</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h3>Voter Participation</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{analytics.voterParticipation}%</p>
          <p style={{ color: '#666', fontSize: '14px' }}>Average across all elections</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
