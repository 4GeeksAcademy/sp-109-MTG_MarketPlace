import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const VendedorRegistro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", correo: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al registrar");

      alert("✅ Cuenta creada correctamente. Inicia sesión.");
      navigate("/vendedor/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4 gothic-font-user">Registrarse como Vendedor</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <div className="mb-3">
          <label className="form-label gothic-font-user">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label gothic-font-user">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label gothic-font-user">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-dark w-100 gothic-font-user">Registrarse</button>

        <div className="mt-3 text-center">
          <Link to="/vendedor/login" className="gothic-font-user">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};
