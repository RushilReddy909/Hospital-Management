import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

// Accept `children` and optional `roles` prop
const ProtectedRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await api.get("/user"); // expected to return user object
      return res.data.data;
    },
    enabled: !!token, // don't fetch if there's no token
    retry: false,
  });

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) return null;
  if (isError || !user) return <Navigate to="/login" replace />;

  const allowed = roles.length === 0 || roles.includes(user.role);
  if (!allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
