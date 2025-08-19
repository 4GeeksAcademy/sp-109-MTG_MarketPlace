import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const CompradorRegistro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/compradores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error al registrar");
        return;
      }

      setExito("Registro exitoso 🎉, ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/comprador/login"), 1500);

    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Registro de Comprador</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Usuario</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <button className="btn btn-success w-100">Registrarse</button>
      </form>

      <div className="mt-3 text-center">
        ¿Ya tienes cuenta? <Link to="/comprador/login">Inicia sesión aquí</Link>
      </div>
    </div>
  );
};