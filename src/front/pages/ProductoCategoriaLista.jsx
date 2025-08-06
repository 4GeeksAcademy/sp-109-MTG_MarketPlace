import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/producto-categoria";

export const ProductoCategoriaLista = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const getItems = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Error al cargar producto-categoría:", err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar registro?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) getItems();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista Producto-Categoría</h2>
      <div className="mb-3">
        <Link to="/producto-categoria/nuevo" className="btn btn-success me-2">
          Crear Registro
        </Link>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Inicio
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto ID</th>
            <th>Categoría ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.producto_id} - {i.producto_nombre}</td>
              <td>{i.categoria_id} - {i.categoria_nombre}</td>
              <td>
                <button
                  onClick={() => navigate(`/producto-categoria/${i.id}`)}
                  className="btn btn-info btn-sm me-2"
                >
                  Detalles
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/producto-categoria/editar/${i.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(i.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
