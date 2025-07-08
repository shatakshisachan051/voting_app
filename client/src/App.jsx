import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import VoterProfile from "./components/VoterProfile";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  console.log("🌐 App.jsx render: isLoggedIn =", isLoggedIn);
  console.log("👤 App.jsx user =", user);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/profile"
          element={
            <VoterProfile
              isLoggedIn={isLoggedIn}
              user={user}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
