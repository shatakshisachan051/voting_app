import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div>
      <h2>👑 Admin Dashboard</h2>
      <p>Welcome, {user.name} (Admin)</p>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/admin/users")}>👥 Manage Users</button>
        <button onClick={() => navigate("/admin/elections")}>🗳️ Manage Elections</button>
        <button onClick={() => navigate("/admin/analytics")}>📊 View Analytics</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
