import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación estática simple
    if (email === "f@gmail.com" && password === "Fernando123") {
      localStorage.setItem("adminToken", "token-admin-simple");
      navigate("/admin-dashboard");
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login Administrador</h2>
      <form onSubmit={handleSubmit} className="card card-body shadow">
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>
  );
};
