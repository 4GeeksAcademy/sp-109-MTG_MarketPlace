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
      <h2 className="text-center mb-4 gothic-font-user">Registro de Comprador</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <div className="mb-3">
          <label className="form-label gothic-font-user">Usuario</label>
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
          <label className="form-label gothic-font-user">Correo electrónico</label>
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
          <label className="form-label gothic-font-user">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <button className="btn btn-dark w-100 gothic-font-user">Registrarse</button>

        <div className="mt-3 text-center gothic-font-user">
          ¿Ya tienes cuenta? <Link to="/comprador/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
};
