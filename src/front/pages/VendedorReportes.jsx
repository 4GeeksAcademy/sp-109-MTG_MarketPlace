import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VendedorReportes = () => {
  const [reporte, setReporte] = useState([]);
  const [error, setError] = useState("");
  const vendedorId = localStorage.getItem("vendedorId");
  const token = localStorage.getItem("tokenVendedor");
  const navigate = useNavigate();

    const fetchReporte = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/reportes`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        throw new Error("Error al obtener el reporte");
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setReporte(data);
      } else {
        throw new Error("Respuesta no válida del servidor (no es JSON)");
      }

    } catch (err) {
      setError(err.message);
      console.error("❌ Error:", err);
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>📈 Reporte de Ventas</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {reporte.length === 0 ? (
        <p>No hay ventas registradas aún.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Vendida</th>
              <th>Precio Unitario</th>
              <th>Total Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {reporte.map(item => (
              <tr key={item.producto_id}>
                <td>{item.nombre}</td>
                <td>{item.vendidos}</td>
                <td>${item.precio_unitario.toFixed(2)}</td>
                <td>${item.total_ingresos.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/vendedor/dashboard")}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};