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
import CompleteProfile from "./components/CompleteProfile";
import AdminDashboard from "./components/AdminDashboard";
import AdminElections from "./components/AdminElections";
import AdminUsers from "./components/AdminUsers";
import AdminAnalytics from "./components/AdminAnalytics";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setIsLoggedIn(true);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Helper function to handle voter redirects based on profile status
  const getVoterRedirect = () => {
    if (!user?.isProfileComplete) {
      return <Navigate to="/complete-profile" />;
    }
    return <Navigate to="/edit-profile" />;
  };

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
                getVoterRedirect()
              )
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
            )
          }
        />
        <Route
          path="/register"
          element={isLoggedIn ? getVoterRedirect() : <Register />}
        />
        <Route
          path="/complete-profile"
          element={
            isLoggedIn && user?.role === "voter" ? (
              user?.isProfileComplete ? (
                <Navigate to="/edit-profile" />
              ) : (
                <CompleteProfile user={user} setUser={setUser} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isLoggedIn && user?.role === "voter" ? (
              user?.isProfileComplete ? (
                <Navigate to="/edit-profile" />
              ) : (
                <Navigate to="/complete-profile" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/voting"
          element={
            isLoggedIn && user?.role === "voter" ? (
              user?.isProfileComplete ? (
                <Voting user={user} isLoggedIn={isLoggedIn} />
              ) : (
                <Navigate to="/complete-profile" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/history"
          element={
            isLoggedIn && user?.role === "voter" ? (
              user?.isProfileComplete ? (
                <VotingHistory user={user} />
              ) : (
                <Navigate to="/complete-profile" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/edit-profile"
          element={
            isLoggedIn && user?.role === "voter" ? (
              user?.isProfileComplete ? (
                <EditProfile user={user} setUser={setUser} />
              ) : (
                <Navigate to="/complete-profile" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin routes */}
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
