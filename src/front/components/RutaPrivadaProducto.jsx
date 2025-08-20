import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const RutaPrivadaProducto = ({ children }) => {
    const tokenVendedor = localStorage.getItem("tokenVendedor");
    const tokenUserAdmin = localStorage.getItem("tokenUserAdmin");
    const location = useLocation();

    if (!tokenVendedor && !tokenUserAdmin) {
        // Nadie logueado → redirige a login de vendedor
        return <Navigate to="/vendedor/login" state={{ from: location }} replace />;
    }

    // Renderiza contenido si hay vendedor o admin
    return children;
};