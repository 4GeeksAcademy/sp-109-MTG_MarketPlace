import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const CarritoDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL + `/api/carritos/${id}`;

  useEffect(() => {
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener carrito");
        return res.json();
      })
      .then(setCarrito)
      .catch(err => {
        console.error("❌ Error:", err);
        alert("No se pudo cargar el carrito.");
      });
  }, [id]);

  if (!carrito) return <p className="text-center">Cargando carrito...</p>;

  const calcularTotal = () => {
    return carrito.items.reduce((total, item) => {
      const precio = item.producto?.precio || 0;
      return total + item.cantidad * precio;
    }, 0);
  };

  return (
    <div className="container mt-4">
      <h2>Detalles del Carrito</h2>

      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>ID:</strong> {carrito.id}</li>
        <li className="list-group-item">
          <strong>Comprador:</strong>{" "}
          {carrito.comprador?.username
            ? `${carrito.comprador.username} (ID: ${carrito.comprador.id})`
            : `ID: ${carrito.id_comprador}`}
        </li>
        <li className="list-group-item"><strong>Estado:</strong> {carrito.status}</li>
      </ul>

      <h4>Ítems del Carrito</h4>
      {carrito.items.length === 0 ? (
        <p>Este carrito no contiene ítems.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.items.map(item => {
                const nombre = item.producto?.nombre || "Desconocido";
                const idProducto = item.producto?.id || item.producto_id;
                const precio = item.producto?.precio || 0;
                const subtotal = item.cantidad * precio;
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{nombre} (ID: {idProducto})</td>
                    <td>{item.cantidad}</td>
                    <td>${precio.toFixed(2)}</td>
                    <td>${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-end fw-bold fs-5">
            Total: ${calcularTotal().toFixed(2)}
          </div>
        </>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate("/carritos")}>
        Volver a la lista
      </button>
    </div>
  );
};