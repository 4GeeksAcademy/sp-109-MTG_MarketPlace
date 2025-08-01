import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const CategoriaDetalle = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    fetch(`${backendUrl}/categorias/${id}`)
      .then(res => res.json())
      .then(data => setCategoria(data))
      .catch(err => console.error("Error cargando categoría:", err));
  }, [id]);

  if (!categoria) return <p>Cargando detalles...</p>;

  return (
    <div className="container mt-4">
      <h2>Detalle de Categoría</h2>
      <p><strong>ID:</strong> {categoria.id}</p>
      <p><strong>Nombre:</strong> {categoria.nombre}</p>
      <Link className="btn btn-secondary mt-3" to="/categorias">Volver</Link>
    </div>
  );
};
