import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const CompradorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/compradores/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error en el login");
        return;
      }

      localStorage.setItem("tokenComprador", data.token);
      localStorage.setItem("compradorUsername", data.username);

      const destino = location.state?.from?.pathname || "/compradores";
      navigate(destino, { replace: true });
    } catch (err) {
      setError("Error al conectar con el servidor.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Iniciar sesión como Comprador</h2>
      <form onSubmit={handleSubmit}>
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

        <button className="btn btn-primary w-100">Iniciar Sesión</button>
      </form>

      <div className="mt-3 text-center">
        ¿No tienes cuenta?{" "}
        <Link to="/comprador/registro">Regístrate aquí</Link>
      </div>
    </div>
  );
};
