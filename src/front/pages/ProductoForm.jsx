import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";
const VENDEDORES_API = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

// Configuración Cloudinary
const CLOUD_NAME = "dtewr1sbt"; 
const UPLOAD_PRESET = "productos_preset"; 
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const ProductoForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    vendedor_id: "",
    imagen: "",
  });
  const [vendedores, setVendedores] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if (editing) {
      fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((data) => setForm(data))
        .catch((err) => console.error("❌ Error al cargar producto:", err));
    }
  }, [id]);

  useEffect(() => {
    fetch(VENDEDORES_API)
      .then((res) => res.json())
      .then(setVendedores)
      .catch((err) => console.error("❌ Error al cargar vendedores:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, imagen: data.secure_url }));
    } catch (err) {
      console.error("❌ Error subiendo imagen:", err);
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.precio || isNaN(form.precio)) newErrors.precio = "Precio válido requerido.";
    if (!form.vendedor_id) newErrors.vendedor_id = "Selecciona un vendedor.";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, precio: parseFloat(form.precio) }),
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

        <select
          name="vendedor_id"
          className="form-control mb-2"
          value={form.vendedor_id}
          onChange={handleChange}
        >
          <option value="">-- Selecciona un vendedor --</option>
          {vendedores.map((v) => (
            <option key={v.id} value={v.id}>
              {v.username} (ID: {v.id})
            </option>
          ))}
        </select>
        {errors.vendedor_id && <div className="text-danger">{errors.vendedor_id}</div>}

        {/* Upload de imagen */}
        <input
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={handleImageUpload}
        />
        {uploading && <p>Subiendo imagen...</p>}
        {form.imagen && (
          <div className="mb-2">
            <img src={form.imagen} alt="Vista previa" style={{ maxWidth: "200px" }} />
          </div>
        )}

        <div className="d-flex gap-2">
          <button className="btn btn-success" disabled={uploading}>
            {editing ? "Guardar cambios" : "Crear"}
          </button>
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