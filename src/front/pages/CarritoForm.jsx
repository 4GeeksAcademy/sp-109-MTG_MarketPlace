import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const CarritoForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ id_comprador: "", status: "open" });
  const [compradores, setCompradores] = useState([]);
  const [loadingCompradores, setLoadingCompradores] = useState(true);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL + "/api/carritos" + (id ? `/${id}` : "");

  const estados = ["open", "pagado", "enviado", "entregado", "cancelado"];

  useEffect(() => {
    const fetchCompradores = async () => {
      setLoadingCompradores(true);
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/compradores");
        if (!res.ok) throw new Error("Error al obtener compradores");
        const data = await res.json();
        setCompradores(data);
      } catch (err) {
        console.error("❌ Error al obtener compradores:", err);
        setError("Error al cargar compradores");
      } finally {
        setLoadingCompradores(false);
      }
    };

    fetchCompradores();

    if (id) {
      const fetchCarrito = async () => {
        setLoadingForm(true);
        try {
          const res = await fetch(API);
          if (!res.ok) throw new Error("Error al cargar carrito");
          const data = await res.json();
          setForm(data);
        } catch (err) {
          console.error("❌ Error al cargar carrito:", err);
          setError("Error al cargar carrito");
        } finally {
          setLoadingForm(false);
        }
      };
      fetchCarrito();
    }
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoadingForm(true);
    try {
      const res = await fetch(API, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar carrito");
      navigate("/carritos");
    } catch (err) {
      console.error("❌", err);
      setError("No se pudo guardar el carrito.");
    } finally {
      setLoadingForm(false);
    }
  };

  if (loadingCompradores) return <p>Cargando compradores...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Carrito" : "Crear Carrito"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Comprador</label>
          <select
            className="form-control"
            name="id_comprador"
            value={form.id_comprador}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un comprador</option>
            {compradores.map(c => (
              <option key={c.id} value={c.id}>
                {c.username} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Estado</label>
          <select
            className="form-control"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un estado</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        <button
          className={`btn ${id ? "btn-warning" : "btn-success"}`}
          disabled={loadingForm}
        >
          {loadingForm ? "Guardando..." : (id ? "Guardar Cambios" : "Crear")}
        </button>
      </form>
    </div>
  );
};
