import React, { useEffect, useState } from "react";

export const CompradorCarrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarrito = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("tokenComprador");
        if (!token) {
          setError("Debes iniciar sesión como comprador.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/comprador/carrito/items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.msg || "Error al obtener el carrito");
          setLoading(false);
          return;
        }

        setCarrito(data);
      } catch (err) {
        console.error("❌ Error al obtener el carrito:", err);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
  }, []);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!carrito || carrito.items.length === 0)
    return <p>No tienes productos en tu carrito.</p>;

  return (
    <div className="container mt-4">
      <h2>🛒 Mi Carrito</h2>

      {carrito.items.map((item) => (
        <div key={item.item_id} className="card mb-2 p-3 shadow-sm">
          <h5>{item.producto.nombre}</h5>
          <p>{item.producto.descripcion}</p>
          <p>Precio: ${item.producto.precio}</p>
          <p>Cantidad: {item.cantidad}</p>
          <p>
            <strong>Subtotal:</strong> ${item.subtotal}
          </p>
        </div>
      ))}

      <div className="text-end mt-3">
        <h4>Total: ${carrito.total}</h4>
        <button className="btn btn-primary">Continuar</button>
      </div>
    </div>
  );
};