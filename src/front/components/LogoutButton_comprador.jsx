import React from "react";
import { useNavigate } from "react-router-dom";

export const LogoutComprador = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token_comprador");
    localStorage.removeItem("comprador_username");

    navigate("/comprador/login");
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};