import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { FaUserCircle } from "react-icons/fa";
import { removeFeed } from "../utils/feedSlice";
import { removeConnection } from "../utils/connectionSlice";
import { removeRequest } from "../utils/request";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Added
  const [lastName, setLastName] = useState(""); // Added
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /.{6,}/;

  // Inside LoginSignup.jsx

const handleAuth = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
  }

  if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
  }

  if (!passwordRegex.test(password)) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
  }

  if (!isLogin) {
      if (!firstName || !lastName) {
          setError("First name and last name are required.");
          setIsLoading(false);
          return;
      }
      if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
      }
  }

  const endpoint = isLogin ? "/login" : "/signup";
  const payload = isLogin 
      ? { email, password } 
      : { email, password, confirmPassword, firstName, lastName }; 
      
  // Always redirect to the main feed page ("/") after successful login or signup
  const successRedirect = "/"; 

  try {
      const res = await axios.post(
          BASE_URL + endpoint,
          payload,
          { withCredentials: true }
      );
      
      // 🚀 CRITICAL FIX: Correctly extract user data based on the endpoint.
      // Login returns user object directly (res.data).
      // Signup returns user object nested under 'data' (res.data.data).
      const userData = isLogin ? res.data : res.data.data;
      
      if (userData) {
          dispatch(addUser(userData));
      } else {
          // Should not happen if backend is correct, but handles unexpected response
          throw new Error("User data was not received from the server.");
      }

      // Clear stale state for a fresh start
      dispatch(removeFeed());
      dispatch(removeConnection());
      dispatch(removeRequest());
      
      // Navigate to the main feed page
      navigate(successRedirect); 
      
  } catch (err) {
      const errorMessage = err?.response?.data?.message || (isLogin ? "Login failed. Please check your credentials." : "Signup failed. Please try again.");
      setError(errorMessage);
      console.log("Auth error:", err);
  } finally {
      setIsLoading(false);
  }
};

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans">
      <div className="bg-gray-800 text-white rounded-xl p-8 sm:p-10 shadow-lg max-w-sm w-full transition-all duration-300 transform hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-teal-400">
          {isLogin ? "Login to DevConnect" : "Join DevConnect"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-4">
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                aria-label="First Name"
                required
              />
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                aria-label="Last Name"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              aria-label="Email Address"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
              aria-label="Password"
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                aria-label="Confirm Password"
                required
              />
            </div>
          )}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full p-4 bg-teal-500 hover:bg-teal-600 text-gray-900 font-bold rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.062 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleForm} className="text-teal-400 hover:underline font-bold">
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;