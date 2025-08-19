import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_PRODUCTOS = import.meta.env.VITE_BACKEND_URL + "/api/productos";
const API_VENDEDORES = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const TiendaVendedoresCartas = () => {
  const { vendedorId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendedor, setVendedor] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        // 1️⃣ Obtener todos los productos y filtrar por vendedor
        const resProductos = await fetch(API_PRODUCTOS);
        if (!resProductos.ok) throw new Error(`Error ${resProductos.status}`);
        const dataProductos = await resProductos.json();
        const productosVendedor = (Array.isArray(dataProductos) ? dataProductos : [])
          .filter((p) => p.vendedor_id === Number(vendedorId))
          .map((p) => ({
            id: p.id,
            nombre: p.nombre,
            detalle: p.descripcion || "Sin descripción",
            precio: p.precio || 0,
            imagen: p.imageUrl || "https://placehold.co/400x300?text=Sin+imagen",
          }));
        setProductos(productosVendedor);

        // 2️⃣ Obtener info del vendedor
        const resVendedor = await fetch(`${API_VENDEDORES}/${vendedorId}`);
        if (!resVendedor.ok) throw new Error(`Error ${resVendedor.status}`);
        const dataVendedor = await resVendedor.json();
        setVendedor(dataVendedor);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setProductos([]);
        setVendedor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [vendedorId]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">
        {vendedor ? `Tienda de ${vendedor.username}` : "Tienda del Vendedor"}
      </h1>

      {loading ? (
        <p className="text-center">Cargando cartas…</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-muted">No hay cartas para este vendedor.</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {productos.map((p) => (
            <div key={p.id} className="card" style={{ width: "18rem" }}>
              <img
                src={p.imagen}
                className="card-img-top"
                alt={p.nombre}
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
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text">{p.detalle}</p>
                <p className="fw-bold">${p.precio}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/tienda/vendedores")}
        >
          Volver a la Tienda de Vendedores
        </button>
      </div>
    </div>
  );
};
