import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RutaPrivadaVendedor = ({ children }) => {
  const token = localStorage.getItem("tokenVendedor");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/vendedor/login" state={{ from: location }} replace />;
  }

  return children;
};