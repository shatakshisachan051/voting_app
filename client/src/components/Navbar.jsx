import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      {!isLoggedIn && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
