import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/producto-categoria";

export const ProductoCategoriaDetalle = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error al cargar detalle: ${res.status}`);
        return res.json();
      })
      .then(data => setItem(data))
      .catch(err => setError(err.message));
  }, [id]);

  if(error) return <p className="text-danger">{error}</p>;
  if (!item) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Detalle Producto-Categoría</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>ID:</strong> {item.id}</li>
        <li className="list-group-item"><strong>Producto ID:</strong> {item.producto_id}</li>
        <li className="list-group-item"><strong>Categoría ID:</strong> {item.categoria_id}</li>
      </ul>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/producto-categoria")}>
        Volver a la lista
      </button>
    </div>
  );
};
