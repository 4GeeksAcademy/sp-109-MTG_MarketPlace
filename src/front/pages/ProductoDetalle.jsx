import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const ProductoDetalle = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then(setProducto)
      .catch((err) => console.error("❌ Error al obtener producto:", err));
  }, [id]);

  if (!producto) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <h3>Detalles del Producto</h3>
      <p><strong>Nombre:</strong> {producto.nombre}</p>
      <p><strong>Descripción:</strong> {producto.descripcion}</p>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>ID del Vendedor:</strong> {producto.vendedor_id}</p>
      <button className="btn btn-secondary" onClick={() => navigate("/productos")}>Volver a Lista</button>
    </div>
  );
};