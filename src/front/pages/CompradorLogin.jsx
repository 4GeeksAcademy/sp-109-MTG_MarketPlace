import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";

export const CompradorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comprador/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error en el login");
        return;
      }

      // Almacenar datos del comprador
      localStorage.setItem("tokenComprador", data.token);
      localStorage.setItem("compradorUsername", data.username);
      localStorage.setItem("compradorId", data.comprador_id);

      // Redirección después del login
      const destino = location.state?.from?.pathname || "/";
      navigate(destino, { replace: true });
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Iniciar sesión como Comprador</h2>

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

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-3 text-center">
        ¿No tienes cuenta?{" "}
        <Link to="/comprador/registro">Regístrate aquí</Link>
      </div>

      <div className="mt-2 text-center">
        <Link to="/comprador/recuperar-contrasena">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      </div>
  );
};