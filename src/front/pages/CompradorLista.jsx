import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/compradores";

export const CompradorLista = () => {
  const [compradores, setCompradores] = useState([]);
  const navigate = useNavigate();

  const getCompradores = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Error al obtener compradores");
      const data = await res.json();
      setCompradores(data);
    } catch (err) {
      console.error("❌ Error al cargar compradores:", err.message);
    }
  };

  useEffect(() => {
    getCompradores();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar comprador?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) getCompradores();
    } catch (err) {
      console.error("❌ Error al eliminar comprador:", err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lista de Compradores</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compradores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.username}</td>
              <td>{c.correo}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/compradores/editar/${c.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 d-flex gap-3">
        <Link to="/compradores/nuevo" className="btn btn-success">
          Crear Comprador
        </Link>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
