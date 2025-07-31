import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/itemcarrito";

export const ItemCarritoLista = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener ítems");
        return res.json();
      })
      .then(setItems)
      .catch(err => {
        console.error("❌ Error:", err);
        alert("Error al cargar los ítems.");
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar ítem del carrito?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("Error al eliminar ítem.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ítems del Carrito</h2>

      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Comprador</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.producto?.nombre || "N/A"}{" "}
                <small className="text-muted">(ID: {item.producto_id})</small>
              </td>
              <td>
                {item.carrito?.comprador?.username || "N/A"}{" "}
                <small className="text-muted">(ID: {item.carrito?.comprador?.id})</small>
              </td>
              <td>{item.cantidad}</td>
              <td>
                <Link to={`/itemcarrito/detalles/${item.id}`} className="btn btn-info btn-sm me-1">
                  Detalles
                </Link>
                <Link to={`/itemcarrito/editar/${item.id}`} className="btn btn-warning btn-sm me-1">
                  Editar
                </Link>
                <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                  Eliminar
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">No hay ítems en el carrito</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Volver
        </button>
        <Link to="/itemcarrito/nuevo" className="btn btn-success">
          Nuevo Ítem
        </Link>
      </div>
    </div>
  );
};