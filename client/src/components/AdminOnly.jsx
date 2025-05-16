import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { admin } from "@/utils/api";

const AdminOnly = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null (for loading state)
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false); // No token found, set as unauthenticated
      return;
    }

    // Verify token with the backend
    const adminOnly = async () => {
      try {
        const response = await admin.get("/verify");
        // If the response is successful, the token is valid
        setIsAuthenticated(true);
      } catch (error) {
        // If the token verification fails (e.g., invalid or expired token)
        setIsAuthenticated(false);
      }
    };

    adminOnly(); // Call the verification function
  }, [token]);

  // While loading, show a loading message or spinner
  if (isAuthenticated === null) return null;

  // If not authenticated, redirect to the login page
  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children (protected page content)
  return <Outlet />;
};

export default AdminOnly;
