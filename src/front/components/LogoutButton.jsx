import React from "react";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token_vendedor");
    localStorage.removeItem("vendedor_username");

    navigate("/vendedor/login");
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};