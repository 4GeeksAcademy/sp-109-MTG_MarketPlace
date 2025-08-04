import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/producto-categoria";

export const ProductoCategoriaForm = () => {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ producto_id: "", categoria_id: "" });
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar opciones para los selects
  const fetchOpciones = async () => {
    try {
      const res = await fetch(`${API}/opciones`);
      const data = await res.json();
      setProductos(data.productos);
      setCategorias(data.categorias);
    } catch (err) {
      console.error("Error cargando opciones:", err);
    }
  };

  // 🔹 Cargar registro si estamos editando
  const fetchRegistro = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      setForm({ producto_id: data.producto_id, categoria_id: data.categoria_id });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpciones();
    fetchRegistro();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `${API}/${id}` : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Error al guardar");

      navigate("/producto-categoria");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Producto-Categoría" : "Crear Producto-Categoría"}</h3>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Producto</label>
          <select
            name="producto_id"
            value={form.producto_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Categoría</label>
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary me-2" type="submit" disabled={loading}>Guardar</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/producto-categoria")} disabled={loading}>Cancelar</button>
      </form>
    </div>
  );
};
