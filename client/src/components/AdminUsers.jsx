import React, { useEffect, useState } from 'react';
import axios from '../axios';

const AdminUsers = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, verified, incomplete

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`/admin/users?filter=${filter}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]);

  const handleVerifyUser = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `/admin/users/${userId}/verify`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the user in the list
      setUsers(users.map(u => 
        u._id === userId ? response.data.user : u
      ));

      alert(response.data.message);
    } catch (err) {
      console.error("Failed to verify user:", err);
      alert(err.response?.data?.message || "Failed to update user verification status");
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Manage Users</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ 
            padding: '8px',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          <option value="all">All Users</option>
          <option value="pending">Pending Verification</option>
          <option value="verified">Verified Users</option>
          <option value="incomplete">Incomplete Profiles</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Voter ID</th>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{user.name || 'Not Set'}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  {!user.isProfileComplete ? '⚠️ Incomplete' :
                   !user.isVerifiedByAdmin ? '⏳ Pending Verification' :
                   '✅ Verified'}
                </td>
                <td style={{ padding: '12px' }}>{user.voterId || 'Not Assigned'}</td>
                <td style={{ padding: '12px' }}>
                  {user.isProfileComplete && !user.isVerifiedByAdmin && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleVerifyUser(user._id, 'approve')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleVerifyUser(user._id, 'reject')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                  {user.isVerifiedByAdmin && (
                    <span style={{ color: 'green' }}>Verified ✓</span>
                  )}
                  {!user.isProfileComplete && (
                    <span style={{ color: 'orange' }}>Awaiting Profile Completion</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
