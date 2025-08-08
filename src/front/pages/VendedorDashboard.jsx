import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VendedorDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("tokenVendedor");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      if (!token) {
        console.warn("⚠️ Token no encontrado en localStorage");
        setError("Token no encontrado. Por favor inicia sesión.");
        return;
      }

      console.log("🔐 Token enviado:", token);

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Error del servidor: ${res.status} - ${msg}`);
        }

        const data = await res.json();
        setProductos(data.productos);
      } catch (err) {
        console.error("❌ Error al obtener productos:", err.message);
        setError("No se pudieron cargar los productos. Revisa tu conexión o el token.");
      }
    };

    fetchProductos();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Mis Productos</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul>
        {productos.map(p => (
          <li key={p.id}>{p.nombre} - ${p.precio}</li>
        ))}
      </ul>

      <div className="mt-4 d-flex flex-column gap-2">
        <button
          className="btn btn-success"
          onClick={() => navigate("/vendedor/reportes")}
        >
          Ver Reportes de Venta
        </button>

        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/vendedor/orders")}
        >
          Ver Órdenes Recibidas
        </button>
      </div>
    </div>
  );
};