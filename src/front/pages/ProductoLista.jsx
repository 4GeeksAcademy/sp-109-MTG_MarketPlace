import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL;
const PRIV_ENDPOINT = `${API_BASE}/api/vendedor/productos`;   // ← solo mis productos (token)
const PROD_ENDPOINT = `${API_BASE}/api/productos`;            // ← CRUD general de productos

export const ProductoLista = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProductos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("tokenVendedor");
      if (!token) {
        throw new Error("No hay token de vendedor. Inicia sesión.");
      }

      const res = await fetch(PRIV_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Error al cargar productos");

      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      alert("❌ " + err.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      const token = localStorage.getItem("tokenVendedor");
      if (!token) {
        alert("❌ No hay token de vendedor. Inicia sesión.");
        return;
      }

      const res = await fetch(`${PROD_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.msg || `Error ${res.status} al eliminar`;
        throw new Error(msg);
      }

      // recargar lista
      await getProductos();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
      alert("❌ " + err.message);
    }
  };

  const fmt = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : v;
  };

  return (
    <div className="container mt-4">
      <h2>Mis productos</h2>

      <div className="mb-3">
        <Link to="/productos/nuevo" className="btn btn-success me-2">
          Crear Producto
        </Link>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Inicio
        </button>
      </div>

      {loading ? (
        <div className="text-muted">Cargando…</div>
      ) : productos.length === 0 ? (
        <div className="alert alert-info">
          No tienes productos todavía. Crea tu primer producto con el botón
          <strong> “Crear Producto”</strong>.
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 80 }}>ID</th>
              <th>Nombre</th>
              <th style={{ width: 140, textAlign: "right" }}>Precio</th>
              <th style={{ width: 260 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td style={{ textAlign: "right" }}>${fmt(p.precio)}</td>
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
      )}
    </div>
  );
};