import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_ENDPOINT = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINT);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      // Validar datos que realmente existen en la tabla productos
      const productosValidos = (Array.isArray(data) ? data : [])
        .filter((p) => p.id && p.nombre) // solo productos con ID y nombre
        .map((p) => ({
          id: p.id,
          nombre: p.nombre,
          detalle: p.descripcion || "Sin descripción",
          precio: p.precio || 0,
          imagen: p.imageUrl || "https://placehold.co/400x300?text=Sin+imagen",
        }));

      setProductos(productosValidos);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Tienda</h1>

      {loading ? (
        <p className="text-center">Cargando productos…</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-muted">No hay productos disponibles.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {productos.map((producto) => (
            <div key={producto.id} className="card" style={{ width: "18rem" }}>
              <img
                src={producto.imagen}
                className="card-img-top"
                alt={producto.nombre}
                style={{
                  objectFit: "contain",
                  height: "200px",
                  width: "100%",
                  backgroundColor: "#f8f9fa",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x300?text=Sin+imagen";
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.detalle}</p>
                <p className="fw-bold">${producto.precio}</p>
                <Link
                  to={`/tienda/detalles/${producto.id}`}
                  className="btn btn-primary mt-auto"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

