import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RutaPrivadaComprador = ({ children }) => {
  const token = localStorage.getItem("tokenComprador");
  const location = useLocation();

  if (!token) {
    // Si no hay token, redirige al login de comprador
    return <Navigate to="/comprador/login" state={{ from: location }} replace />;
  }

  // Si hay token, renderiza el contenido
  return children;
};