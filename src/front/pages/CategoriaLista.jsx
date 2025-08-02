import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/categorias";

export const CategoriaLista = () => {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const getCategorias = async () => {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Error al obtener categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error("❌ Error al cargar categorías:", err.message);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) getCategorias();
      else alert("Error al eliminar la categoría");
    } catch (err) {
      console.error("❌ Error al eliminar categoría:", err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lista de Categorías</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => navigate(`/categorias/${c.id}/detalles`)}
                >
                  Ver
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/categorias/editar/${c.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(c.id)}
                >
                  Borrar
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 d-flex gap-3">
        <Link to="/categorias/nuevo" className="btn btn-success">
          Crear Categoría
        </Link>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};
