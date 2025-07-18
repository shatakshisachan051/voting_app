import React, { useEffect, useState } from "react";
import axios from "../axios";

const AdminElections = ({ user }) => {
  console.log("🔄 AdminElections component rendered", { user });
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
    candidates: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 AdminElections useEffect triggered");
    const fetchElections = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Using token for fetch:", token ? "Token exists" : "No token!");
        const res = await axios.get("/elections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📥 Admin Elections fetched:", res.data);
        setElections(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to fetch elections", {
          error: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("📝 Input changed:", { field: name, value });
    setNewElection((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("🔄 New election state:", updated);
      return updated;
    });
  };

  const handleCreateElection = async () => {
    console.log("➕ Creating new election with data:", newElection);
    const payload = {
      ...newElection,
      candidates: newElection.candidates.split(",").map((c) => c.trim()),
    };
    console.log("📦 Prepared payload:", payload);

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Using token for creation:", token ? "Token exists" : "No token!");
      const res = await axios.post("/elections", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Election created successfully:", res.data);
      alert("Election created successfully!");
      setElections([...elections, res.data]);
      setNewElection({ title: "", startDate: "", endDate: "", candidates: "" });
    } catch (err) {
      console.error("❌ Failed to create election:", {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        payload: payload
      });
      alert(err.response?.data?.message || "Failed to create election.");
    }
  };

  const handleDeleteElection = async (electionId) => {
    console.log("🗑️ Attempting to delete election:", electionId);
    if (!window.confirm("Are you sure you want to delete this election?")) {
      console.log("❌ Election deletion cancelled by user");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Using token for deletion:", token ? "Token exists" : "No token!");
      await axios.delete(`/elections/${electionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Election deleted successfully:", electionId);
      setElections(elections.filter((e) => e._id !== electionId));
      alert("Election deleted successfully!");
    } catch (err) {
      console.error("❌ Failed to delete election:", {
        electionId,
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert(err.response?.data?.message || "Failed to delete election.");
    }
  };

  if (loading) {
    console.log("⌛ Loading elections...");
    return <p>Loading elections...</p>;
  }

  console.log("📊 Rendering elections table with data:", elections);
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
