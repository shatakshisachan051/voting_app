import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "white",
      }}
    >
      <h2>🗳️ Voting App</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        {isLoggedIn ? (
          <>
            {user?.role === "voter" && (
              <>
                <Link to="/profile" style={linkStyle}>
                  Profile
                </Link>
                <Link to="/voting" style={linkStyle}>
                  Voting
                </Link>
                <Link to="/history" style={linkStyle}>
                  History
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin" style={linkStyle}>
                  Dashboard
                </Link>
                <Link to="/admin/elections" style={linkStyle}>
                  Manage Elections
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              style={{
                ...linkStyle,
                backgroundColor: "#e74c3c",
                border: "none",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/register" style={linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
};

export default Navbar;
