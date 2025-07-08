import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import VoterProfile from "./components/VoterProfile";

function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = !!user;

  // Sync user state to localStorage on change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  console.log("🌐 App.jsx render: isLoggedIn =", isLoggedIn);
  console.log("👤 App.jsx user =", user);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/profile"
          element={<VoterProfile user={user} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
