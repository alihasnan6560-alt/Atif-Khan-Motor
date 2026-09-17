// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protects admin-only routes.
 * If the user is not an admin, redirects to the admin login page.
 */
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return isAdmin ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
