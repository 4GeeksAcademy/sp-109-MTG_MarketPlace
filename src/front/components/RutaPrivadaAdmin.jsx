import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RutaPrivadaAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();
  
    if (!token) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  
    return children;
  };