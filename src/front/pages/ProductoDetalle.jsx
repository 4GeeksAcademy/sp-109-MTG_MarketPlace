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
      <hr />
      <div className="row">
        <div className="col-md-6">
          {producto.imageUrl && (
            <img
              src={producto.imageUrl}
              alt={producto.nombre}
              className="img-fluid rounded mb-3"
              onError={(e) => {
                e.target.onerror = null; // Evita bucle infinito
                e.target.src = "https://via.placeholder.com/300"; // Imagen de respaldo
              }}
            />
          )}
        </div>
        <div className="col-md-6">
          <p>
            <strong>Nombre:</strong> {producto.nombre}
          </p>
          <p>
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <p>
            <strong>Precio:</strong> ${producto.precio}
          </p>
          <p>
            <strong>Rareza:</strong> {producto.rarity}
          </p>
          <p>
            <strong>Tipo:</strong> {producto.type}
          </p>
          <p>
            <strong>ID del Vendedor:</strong> {producto.vendedor_id}
          </p>
        </div>
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/productos")}>
        Volver a Lista
      </button>
    </div>
  );
};