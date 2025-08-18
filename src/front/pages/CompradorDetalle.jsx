import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/compradores"; // Cambiado el endpoint

export const CompradorDetalle = () => {
  const { id } = useParams();
  const [comprador, setComprador] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComprador = async () => {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Error al obtener detalles del comprador");
        const data = await res.json();
        setComprador(data);
      } catch (err) {
        console.error("❌ Error al cargar detalles:", err.message);
      }
    };

    fetchComprador();
  }, [id]);

  if (!comprador) return <p>Cargando detalles del comprador...</p>;

  return (
    <div className="container mt-5">
      <h2>Detalles del Comprador</h2> {/* Cambiado el título */}
      <ul className="list-group">
        <li className="list-group-item"><strong>ID:</strong> {comprador.id}</li>
        <li className="list-group-item"><strong>Nombre:</strong> {comprador.username}</li>
        <li className="list-group-item"><strong>Correo:</strong> {comprador.correo}</li>
        {/* Puedes añadir campos específicos de comprador aquí */}
      </ul>
      <button 
        className="btn btn-secondary mt-3" 
        onClick={() => navigate("/compradores")} // Cambiada la ruta de retorno
      >
        Volver a la lista
      </button>
    </div>
  );
};