import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/carritos";

export const CarritoLista = () => {
  const [carritos, setCarritos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener carritos");
        return res.json();
      })
      .then(setCarritos)
      .catch(err => {
        console.error("❌ Error:", err);
        alert("No se pudieron cargar los carritos.");
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este carrito?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setCarritos(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar carrito:", err);
      alert("No se pudo eliminar el carrito.");
    }
  };

  const handleCheckout = (id) => {
    navigate(`/checkout/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Carritos</h2>

      <div className="d-flex justify-content-between mb-3">
        <Link to="/carritos/nuevo" className="btn btn-success">Nuevo Carrito</Link>
        <Link to="/" className="btn btn-secondary">Volver</Link>
      </div>

      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprador</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {carritos.map(carrito => (
            <tr key={carrito.id}>
              <td>{carrito.id}</td>
              <td>
                {carrito.comprador?.username
                  ? `${carrito.comprador.username} (ID: ${carrito.comprador.id})`
                  : `N/A (ID: ${carrito.id_comprador})`}
              </td>
              <td>{carrito.status}</td>
              <td>
                <Link to={`/carritos/detalles/${carrito.id}`} className="btn btn-info btn-sm mx-1">Detalles</Link>
                <Link to={`/carritos/editar/${carrito.id}`} className="btn btn-warning btn-sm mx-1">Editar</Link>
                <button onClick={() => handleDelete(carrito.id)} className="btn btn-danger btn-sm mx-1">Eliminar</button>
                <button onClick={() => handleCheckout(carrito.id)} className="btn btn-success btn-sm mx-1">Checkout</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
