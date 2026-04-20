import { useState } from "react";
import Home from "./pages/Home";
import MatchForm from "./components/MatchForm";
import MatchList from "./components/MatchList";
import LoginForm from "./components/LoginForm";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import SignupForm from "./components/SignupForm";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "tailwindcss";

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <Router>
      {/* Optional navigation for easier access */}
      {/*
      <nav className="p-4 flex gap-4 bg-blue-600">
        <Link to="/">Match List</Link>
        <Link to="/add">Add Match</Link>
        <Link to="/login">Login</Link>
      </nav>
      */}

      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<SignupForm />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MatchList />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <MatchForm onAdd={() => setRefresh(!refresh)} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
