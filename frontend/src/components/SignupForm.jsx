import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
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
    setServerError("");
    if (validate()) {
      try {
        await axios.post("http://localhost:5000/api/auth/register", { email, password });
        alert("Registration successful! Please login.");
        navigate("/login");
      } catch (err) {
        setServerError(err.response?.data?.error || "Registration failed.");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
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

          {serverError && <div className="mb-2 text-red-700 text-sm">{serverError}</div>}

          <button
            type="submit"
            className="w-full py-3 rounded bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors"
          >
            Create new account
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}


/* import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
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

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (validate()) {
      try {
        await axios.post("http://localhost:5000/api/auth/register", { email, password });
        alert("Registration successful! Please login.");
        navigate("/login");
      } catch (error) {
        setServerError(error.response?.data?.error || "Registration failed.");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validate}
          className={`w-full px-3 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          required
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}

        <label htmlFor="password" className="block mt-4 mb-1 font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={validate}
          className={`w-full px-3 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
          required
        />
        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}

        {serverError && <p className="text-red-600 text-sm mt-2">{serverError}</p>}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded mt-6 hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
 */