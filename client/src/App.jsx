import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import VoterProfile from "./components/VoterProfile";
import Voting from "./components/Voting";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already logged in on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  console.log("🌐 App.jsx render: isLoggedIn =", isLoggedIn);
  console.log("👤 App.jsx user =", user);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<h1>🏠 Welcome to the Voting App</h1>} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />

        <Route
          path="/profile"
          element={
            isLoggedIn
              ? <VoterProfile user={user} isLoggedIn={isLoggedIn} />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/voting"
          element={
            isLoggedIn
              ? <Voting user={user} isLoggedIn={isLoggedIn} />
              : <Navigate to="/login" />
          }
        />

        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
