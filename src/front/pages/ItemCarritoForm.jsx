import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const ItemCarritoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    carrito_id: "",
    producto_id: "",
    cantidad: 1
  });

  const [carritos, setCarritos] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar carritos y productos disponibles
    fetch(`${API_BASE}/api/carritos`)
      .then(res => res.json())
      .then(setCarritos)
      .catch(() => alert("Error cargando carritos"));

    fetch(`${API_BASE}/api/productos`)
      .then(res => res.json())
      .then(setProductos)
      .catch(() => alert("Error cargando productos"));

    // Si se está editando, cargar el ítem
    if (id) {
      fetch(`${API_BASE}/api/itemcarrito/${id}`)
        .then(res => res.json())
        .then(setItem)
        .catch(() => alert("Error cargando ítem"));
    }
  }, [id]);

  const handleChange = e => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!item.carrito_id || !item.producto_id || item.cantidad < 1) {
      return alert("Todos los campos son obligatorios y la cantidad debe ser mayor a 0.");
    }

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_BASE}/api/itemcarrito/${id}`
      : `${API_BASE}/api/itemcarrito`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        navigate("/itemcarrito");
      })
      .catch(() => alert("Error al guardar el ítem"));
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Ítem del Carrito" : "Crear Ítem del Carrito"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Carrito</label>
          <select
            name="carrito_id"
            value={item.carrito_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione un carrito</option>
            {carritos.map(c => (
              <option key={c.id} value={c.id}>
                ID {c.id} - Comprador: {c.id_comprador}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Producto</label>
          <select
            name="producto_id"
            value={item.producto_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione un producto</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} (${p.precio})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            value={item.cantidad}
            onChange={handleChange}
            className="form-control"
            min="1"
            required
          />
        </div>

        <button type="submit" className={`btn ${id ? "btn-warning" : "btn-success"}`}>
          {id ? "Guardar Cambios" : "Crear Ítem"}
        </button>
      </form>
    </div>
  );
};