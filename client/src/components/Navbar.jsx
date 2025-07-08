import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid gray" }}>
      <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
      <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
      {user && (
        <>
          <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
