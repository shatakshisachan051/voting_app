import React, { useEffect, useState } from 'react';
import axios from '../axios';

const AdminUsers = ({ user }) => {
  console.log("🔄 AdminUsers component rendered", { user });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, voters, admins

  useEffect(() => {
    console.log("🔄 AdminUsers useEffect triggered with filter:", filter);
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Using token for users fetch:", token ? "Token exists" : "No token!");
        
        const res = await axios.get(`/users?filter=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("👥 Users data received:", {
          count: res.data.length,
          filter: filter
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch users:", {
          error: err.message,
          response: err.response?.data,
          status: err.response?.status,
          filter: filter
        });
        setError(err.response?.data?.message || "Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [filter]);

  const handleDeleteUser = async (userId) => {
    console.log("🗑️ Attempting to delete user:", userId);
    if (!window.confirm("Are you sure you want to delete this user?")) {
      console.log("❌ User deletion cancelled by user");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Using token for user deletion:", token ? "Token exists" : "No token!");
      await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ User deleted successfully:", userId);
      setUsers(users.filter(u => u._id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete user:", {
        userId,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleToggleAdmin = async (userId, currentRole) => {
    const isCurrentlyAdmin = currentRole === 'admin';
    console.log("🔄 Attempting to toggle admin status:", { userId, currentRole });
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Using token for admin toggle:", token ? "Token exists" : "No token!");
      
      const res = await axios.patch(`/users/${userId}/role`, 
        { isAdmin: !isCurrentlyAdmin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ User role updated successfully:", res.data);
      
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: isCurrentlyAdmin ? 'voter' : 'admin' } : u
      ));
      alert("User role updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update user role:", {
        userId,
        currentRole,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert(err.response?.data?.message || "Failed to update user role");
    }
  };

  if (loading) {
    console.log("⌛ Loading users...");
    return <div>Loading users...</div>;
  }

  if (error) {
    console.log("❌ Rendering error state:", error);
    return <div>Error: {error}</div>;
  }

  console.log("👥 Rendering users table with data:", {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    voters: users.filter(u => u.role === 'voter').length
  });

  return (
    <div>
      <h2>👥 Manage Users</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="all">All Users</option>
          <option value="voters">Voters Only</option>
          <option value="admins">Admins Only</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Voter ID</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Role</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.voterId || 'N/A'}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {user.role === 'admin' ? '👑 Admin' : '🗳️ Voter'}
              </td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <button
                  onClick={() => handleToggleAdmin(user._id, user.role)}
                  style={{ marginRight: '10px' }}
                >
                  {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
