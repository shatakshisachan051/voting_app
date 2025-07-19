import React, { useState, useEffect } from 'react';
import axios from '../axios';

const AdminVerification = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/admin/pending-users');
      setPendingUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, isApproved) => {
    try {
      await axios.post(`/admin/verify-user/${userId}`, { isApproved });
      alert(isApproved ? 'User verified successfully!' : 'User verification rejected.');
      // Refresh the list
      fetchPendingUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Pending User Verifications</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Users List */}
        <div style={{ flex: '1', maxWidth: '300px' }}>
          {pendingUsers.length === 0 ? (
            <p>No pending verifications</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedUser?._id === user._id ? '#e3f2fd' : 'white'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>{user.email}</div>
                  <div style={{ fontSize: '0.8em', color: '#888' }}>Voter ID: {user.voterId}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details */}
        {selectedUser && (
          <div style={{ flex: '2', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <h3>User Details</h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Age:</strong> {selectedUser.age}</p>
              <p><strong>Address:</strong> {selectedUser.address}</p>
              <p><strong>Voter ID:</strong> {selectedUser.voterId}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>ID Document</h4>
              {selectedUser.documentPath && (
                <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                  {selectedUser.documentPath.endsWith('.pdf') ? (
                    <embed
                      src={`/uploads/documents/${selectedUser.documentPath}`}
                      type="application/pdf"
                      width="100%"
                      height="500px"
                    />
                  ) : (
                    <img
                      src={`/uploads/documents/${selectedUser.documentPath}`}
                      alt="ID Document"
                      style={{ maxWidth: '100%' }}
                    />
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4>User Photo</h4>
              {selectedUser.photoPath && (
                <img
                  src={`/uploads/photos/${selectedUser.photoPath}`}
                  alt="User Photo"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleVerify(selectedUser._id, true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Approve
              </button>
              <button
                onClick={() => handleVerify(selectedUser._id, false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVerification; 