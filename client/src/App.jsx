import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import VoterProfile from "./components/VoterProfile";
import Voting from "./components/Voting";
import VotingHistory from "./components/VotingHistory";
import EditProfile from "./components/EditProfile";
import AdminDashboard from "./components/AdminDashboard";
import AdminElections from "./components/AdminElections"; // 🆕 admin manage elections
import AdminUsers from "./components/AdminUsers"; // 🆕 Import AdminUsers
import AdminAnalytics from "./components/AdminAnalytics"; // 🆕 Import AdminAnalytics

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              user?.role === "admin" ? (
                <Navigate to="/admin" />
              ) : (
                <Navigate to="/profile" />
              )
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
            )
          }
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/profile" /> : <Register />}
        />
        <Route
          path="/profile"
          element={
            isLoggedIn && user?.role === "voter" ? (
              <VoterProfile user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/voting"
          element={
            isLoggedIn && user?.role === "voter" ? (
              <Voting user={user} isLoggedIn={isLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/history"
          element={
            isLoggedIn && user?.role === "voter" ? (
              <VotingHistory user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-profile"
          element={
            isLoggedIn && user?.role === "voter" ? (
              <EditProfile user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🆕 Admin routes */}
        <Route
          path="/admin"
          element={
            isLoggedIn && user?.role === "admin" ? (
              <AdminDashboard user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/elections"
          element={
            isLoggedIn && user?.role === "admin" ? (
              <AdminElections user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/users"
          element={
            isLoggedIn && user?.role === "admin" ? (
              <AdminUsers user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/analytics"
          element={
            isLoggedIn && user?.role === "admin" ? (
              <AdminAnalytics user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
