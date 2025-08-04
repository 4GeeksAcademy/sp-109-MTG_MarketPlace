import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const ProductoForm = () => {
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const token = localStorage.getItem("tokenVendedor");

  useEffect(() => {
    if (editing) {
      fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio
          });
        })
        .catch((err) => console.error("❌ Error al cargar producto:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.precio || isNaN(form.precio)) newErrors.precio = "Precio válido requerido.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length) {
      setErrors(valErrors);
      return;
    }

    try {
      const res = await fetch(editing ? `${API}/${id}` : API, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio)
        })
      });

      if (!res.ok) throw new Error("Error al guardar");
      navigate("/productos");
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Producto" : "Crear Producto"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          className="form-control mb-2"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <div className="text-danger">{errors.nombre}</div>}

        <textarea
          name="descripcion"
          className="form-control mb-2"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <input
          name="precio"
          className="form-control mb-2"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        />
        {errors.precio && <div className="text-danger">{errors.precio}</div>}

        <div className="d-flex gap-2">
          <button className="btn btn-success">{editing ? "Guardar cambios" : "Crear"}</button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/productos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};