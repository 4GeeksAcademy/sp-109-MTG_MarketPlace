import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export const VendedorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    correo: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Error en el login");
        return;
      }

      localStorage.setItem("tokenVendedor", data.token);
      localStorage.setItem("vendedorUsername", data.username);
      localStorage.setItem("vendedorId", data.vendedor_id);

      const destino = location.state?.from?.pathname || "/vendedores";
      navigate(destino, { replace: true });

    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4 gothic-font-user">Iniciar sesión como Vendedor</h2>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
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

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-dark w-100 gothic-font-user">Iniciar Sesión</button>
      </form>

      <div className="mt-3 text-center">
        ¿No tienes cuenta?{" "}
        <Link to="/vendedor/registro">Regístrate aquí</Link>
      </div>
    </div>
  );
};
