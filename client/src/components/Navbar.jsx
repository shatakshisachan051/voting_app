import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear user & token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // ✅ Update state
    setIsLoggedIn(false);
    setUser(null);

    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#282c34",
        color: "white",
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          🗳 Voting App
        </Link>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              style={{ color: "white", textDecoration: "none" }}
            >
              Profile
            </Link>
            <Link
              to="/voting"
              style={{ color: "white", textDecoration: "none" }}
            >
              Vote
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none" }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
