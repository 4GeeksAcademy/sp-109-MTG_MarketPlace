import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RutaPrivadaComprador = ({ children }) => {
  const token = localStorage.getItem("token_comprador");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/comprador/login" state={{ from: location }} replace />;
  }

  return children;
};
