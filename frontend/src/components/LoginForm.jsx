import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!emailRegex.test(email)) errs.email = "Invalid email format";

    if (!password) errs.password = "Password is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    if (validate()) {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
        login(res.data.token);
        navigate("/");
      } catch (err) {
        setAuthError(err.response?.data?.error || "Login failed. Check your credentials.");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Email address"
            className={`w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validate}
            aria-describedby="email-error"
            aria-invalid={errors.email ? "true" : "false"}
            required
          />
          {errors.email && <div className="text-red-600 text-xs mb-2">{errors.email}</div>}

          <input
            type="password"
            placeholder="Password"
            className={`w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validate}
            aria-describedby="password-error"
            aria-invalid={errors.password ? "true" : "false"}
            required
          />
          {errors.password && <div className="text-red-600 text-xs mb-2">{errors.password}</div>}

          {authError && <div className="mb-2 text-red-700 text-sm">{authError}</div>}

          <button
            type="submit"
            className="w-full py-3 rounded bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
}
