import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h2>Pago cancelado</h2>
      <p>No se ha completado el pago. Puedes intentarlo de nuevo.</p>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/checkout")}>
        Volver al Checkout
      </button>
    </div>
  );
};

export default Cancel;
