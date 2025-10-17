import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // if no token — redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if specific roles are required and user doesn't match
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // everything good → render page
  return children;
};

export default ProtectedRoute;
