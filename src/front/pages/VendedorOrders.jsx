import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VendedorOrders = () => {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("tokenVendedor");
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error al obtener órdenes");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/itemcarrito/${id}/estado`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      await fetchItems(); // recargar lista
    } catch (err) {
      console.error("❌", err);
    }
  };

  const estados = ["get_direction", "in_progress", "enviado", "entregado"];

  return (
    <div className="container mt-4">
      <h2>Órdenes Recibidas</h2>

      {items.length === 0 ? (
        <p>No hay órdenes para mostrar.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Comprador</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.item_id}>
                <td>{item.producto?.nombre}</td>
                <td>{item.cantidad}</td>
                <td>{item.carrito?.comprador?.username}</td>
                <td>
                  <select
                    value={item.estado || ""}
                    onChange={(e) =>
                      handleEstadoChange(item.item_id, e.target.value)
                    }
                    className="form-select"
                  >
                    {estados.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      handleEstadoChange(item.item_id, item.estado)
                    }
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      navigate(`/vendedor/orden/${item.item_id}/procesar`)
                    }
                  >
                    Procesar Venta
                  </button>
                </td>
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