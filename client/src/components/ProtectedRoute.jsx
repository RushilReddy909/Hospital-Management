import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null (for loading state)
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false); // No token found, set as unauthenticated
      return;
    }

    // Verify token with the backend
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );
        // If the response is successful, the token is valid
        setIsAuthenticated(true);
      } catch (error) {
        // If the token verification fails (e.g., invalid or expired token)
        setIsAuthenticated(false);
      }
    };

    verifyToken(); // Call the verification function
  }, [token]);

  // While loading, show a loading message or spinner
  if (isAuthenticated === null) return null;

  // If not authenticated, redirect to the login page
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (protected page content)
  return children;
};

export default ProtectedRoute;
