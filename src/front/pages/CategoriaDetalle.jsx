import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/categorias";

export const CategoriaDetalle = () => {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Error al obtener detalles");
        const data = await res.json();
        setCategoria(data);
      } catch (err) {
        console.error("❌ Error al cargar detalles:", err.message);
      }
    };

    fetchCategoria();
  }, [id]);

  if (!categoria) return <p>Cargando detalles...</p>;

  return (
    <div className="container mt-5">
      <h2>Detalles de la Categoría</h2>
      <ul className="list-group">
        <li className="list-group-item"><strong>ID:</strong> {categoria.id}</li>
        <li className="list-group-item"><strong>Nombre:</strong> {categoria.name}</li>
      </ul>
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/categorias")}>
        Volver a la lista
      </button>
    </div>
  );
};
