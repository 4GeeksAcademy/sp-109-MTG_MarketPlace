import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const ProductoLista = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const getProductos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
    }
  };

  useEffect(() => {
    getProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) getProductos();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      <div className="mb-3">
        <Link to="/productos/nuevo" className="btn btn-success me-2">
          Crear Producto
        </Link>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>Inicio</button>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => navigate(`/productos/detalles/${p.id}`)}
                >
                  Detalles
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/productos/editar/${p.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.id)}
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