import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ItemCarritoDetalle = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL + `/api/itemcarrito/${id}`;

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setItem);
  }, [id]);

  if (!item) return <p className="text-light">Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Detalle del Ítem</h2>
      <ul className="list-group">
        <li className="list-group-item">ID: {item.id}</li>
        <li className="list-group-item">Carrito ID: {item.carrito_id}</li>
        <li className="list-group-item">Producto: {item.producto?.nombre || item.producto_id}</li>
        <li className="list-group-item">Cantidad: {item.cantidad}</li>
      </ul>
      <button onClick={() => navigate("/itemcarrito")} className="btn btn-secondary mt-3">Volver</button>
    </div>
  );
};