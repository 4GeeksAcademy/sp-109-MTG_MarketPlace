import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const CarritoForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ id_comprador: "", status: "open" });
  const [compradores, setCompradores] = useState([]);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL + "/api/carritos" + (id ? `/${id}` : "");

  const estados = ["open", "pagado", "enviado", "entregado", "cancelado"];

  useEffect(() => {
 
    fetch(import.meta.env.VITE_BACKEND_URL + "/api/compradores")
      .then(res => res.json())
      .then(setCompradores)
      .catch(err => console.error("❌ Error al obtener compradores:", err));

   
    if (id) {
      fetch(API)
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(err => console.error("❌ Error al cargar carrito:", err));
    }
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    fetch(API, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (res.ok) navigate("/carritos");
        else throw new Error("Error al guardar carrito");
      })
      .catch(err => {
        console.error("❌", err);
        alert("No se pudo guardar el carrito.");
      });
  };

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

        <button className={`btn ${id ? "btn-warning" : "btn-success"}`}>
          {id ? "Guardar Cambios" : "Crear"}
        </button>
      </form>
    </div>
  );
};