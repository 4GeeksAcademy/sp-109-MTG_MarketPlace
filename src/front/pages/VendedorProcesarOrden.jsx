import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const VendedorProcesarOrden = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    direccion: "",
    detalle: "",
    latitud: "",
    longitud: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendedor/orden/${itemId}/direccion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("tokenVendedor")}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Error al guardar dirección");
      }

      navigate("/vendedor/orders");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Procesar Venta - Ítem #{itemId}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Detalle</label>
          <textarea
            name="detalle"
            value={form.detalle}
            onChange={handleChange}
            className="form-control"
            rows="3"
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Latitud</label>
          <input
            type="text"
            name="latitud"
            value={form.latitud}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Longitud</label>
          <input
            type="text"
            name="longitud"
            value={form.longitud}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Confirmar Dirección y Procesar
        </button>

        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};