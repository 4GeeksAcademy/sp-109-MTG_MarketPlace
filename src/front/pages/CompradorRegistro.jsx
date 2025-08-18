import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/compradores";

export const CompradorRegistro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    username: "", 
    correo: "", 
    password: "",
    direccion: "",
    telefono: ""
  });
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

      alert("✅ Cuenta de comprador creada correctamente. Inicia sesión.");
      navigate("/comprador/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Registrarse como Comprador</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Nombre de usuario</label>
            <input 
              type="text" 
              className="form-control" 
              name="username" 
              value={form.username} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            minLength="8"
          />
          <small className="text-muted">Mínimo 8 caracteres</small>
        </div>

        <div className="mb-3">
          <label>Dirección</label>
          <input 
            type="text" 
            className="form-control" 
            name="direccion" 
            value={form.direccion} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="mb-3">
          <label>Teléfono (opcional)</label>
          <input 
            type="tel" 
            className="form-control" 
            name="telefono" 
            value={form.telefono} 
            onChange={handleChange} 
          />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary">Registrarse</button>
          <Link to="/comprador/login" className="btn btn-link">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
};