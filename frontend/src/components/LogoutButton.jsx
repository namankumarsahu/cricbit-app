import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
