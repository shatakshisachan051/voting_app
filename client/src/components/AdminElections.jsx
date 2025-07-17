import React, { useEffect, useState } from "react";
import axios from "../axios";

const AdminElections = ({ user }) => {
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
    candidates: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📥 Admin Elections fetched:", res.data);
        setElections(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch elections", err);
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewElection((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateElection = async () => {
    const payload = {
      ...newElection,
      candidates: newElection.candidates.split(",").map((c) => c.trim()), // Split by comma
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/elections", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Election created:", res.data);
      alert("Election created successfully!");
      setElections([...elections, res.data]); // Add new election to list
      setNewElection({ title: "", startDate: "", endDate: "", candidates: "" }); // Reset form
    } catch (err) {
      console.error("❌ Failed to create election:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create election.");
    }
  };

  const handleDeleteElection = async (electionId) => {
    if (!window.confirm("Are you sure you want to delete this election?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElections(elections.filter((e) => e._id !== electionId));
      alert("Election deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete election:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete election.");
    }
  };

  if (loading) return <p>Loading elections...</p>;

  return (
    <div>
      <h2>🗳️ Manage Elections</h2>

      {/* Create Election Form */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>➕ Add New Election</h3>
        <input
          type="text"
          name="title"
          placeholder="Election Title"
          value={newElection.title}
          onChange={handleInputChange}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="date"
          name="startDate"
          value={newElection.startDate}
          onChange={handleInputChange}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="date"
          name="endDate"
          value={newElection.endDate}
          onChange={handleInputChange}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <input
          type="text"
          name="candidates"
          placeholder="Candidates (comma-separated)"
          value={newElection.candidates}
          onChange={handleInputChange}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button onClick={handleCreateElection}>✅ Create Election</button>
      </div>

      {/* Elections Table */}
      <h3>📋 All Elections</h3>
      {elections.length === 0 ? (
        <p>No elections found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Dates</th>
              <th>Candidates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((e) => (
              <tr key={e._id}>
                <td>{e.title}</td>
                <td>
                  {new Date(e.startDate).toLocaleDateString()} -{" "}
                  {new Date(e.endDate).toLocaleDateString()}
                </td>
                <td>{e.candidates.join(", ")}</td>
                <td>
                  <button
                    onClick={() => handleDeleteElection(e._id)}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminElections;
