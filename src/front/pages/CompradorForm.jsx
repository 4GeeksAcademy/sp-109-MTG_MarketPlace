import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/compradores";

const validate = ({ username, correo }) => {
  const errors = {};
  if (!username.trim()) errors.username = "El nombre es obligatorio.";
  if (!correo.trim()) {
    errors.correo = "El correo es obligatorio.";
  } else if (!/@(gmail|hotmail|yahoo)\.com$/.test(correo)) {
    errors.correo = "Correo no válido. Usa @gmail, @hotmail o @yahoo.";
  }
  return errors;
};

export const CompradorForm = () => {
  const [form, setForm] = useState({ username: "", correo: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);

  useEffect(() => {
    if (editing) {
      fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((data) => setForm({ username: data.username, correo: data.correo }))
        .catch((err) => console.error("❌ Error al cargar comprador:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate(form);
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    try {
      const res = await fetch(editing ? `${API}/${id}` : API, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ general: data.msg || "Error al enviar formulario" });
        return;
      }

      navigate("/compradores");
    } catch (err) {
      console.error("❌ Error al enviar:", err.message);
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Comprador" : "Crear Nuevo Comprador"}</h3>

      {errors.general && <div className="alert alert-danger">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
        </div>

        <div className="mb-3">
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className={`form-control ${errors.correo ? "is-invalid" : ""}`}
          />
          {errors.correo && <div className="invalid-feedback d-block">{errors.correo}</div>}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            {editing ? "Guardar cambios" : "Crear comprador"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/compradores")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
