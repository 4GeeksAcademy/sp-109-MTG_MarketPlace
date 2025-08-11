import React from "react";
import { Navigate } from "react-router-dom";

export const RutaPrivadaUserAdmin = ({ children }) => {
    const tokenUserAdmin = localStorage.getItem("tokenUserAdmin");

    if (!tokenUserAdmin) {
        return <Navigate to="/useradmin/login" replace />;
    }

    return children;
};