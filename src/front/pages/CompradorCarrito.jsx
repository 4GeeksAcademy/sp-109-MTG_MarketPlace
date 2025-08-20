import React, { useEffect, useState } from "react";

export const CompradorCarrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

 
  const toAbsoluteUrl = (src) => {
    if (!src) return null;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
  };

  const getProductoImage = (producto) => {
    const raw =
      producto?.imageUrl || producto?.imagen_url || producto?.imagen || null;
    return toAbsoluteUrl(raw) || "https://placehold.co/400x300?text=Sin+imagen";
  };

  const formatMoney = (n) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(n || 0));

  useEffect(() => {
    const controller = new AbortController();

    const fetchCarrito = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("tokenComprador");
        if (!token) {
          setError("Debes iniciar sesión como comprador.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/comprador/carrito/items`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

       
        let data = null;
        try {
          data = await res.json();
        } catch {
         
        }

        if (!res.ok) {
          setError((data && (data.msg || data.error)) || "Error al obtener el carrito");
          setLoading(false);
          return;
        }

     
        const items = Array.isArray(data?.items) ? data.items : [];
        const total = Number(data?.total || 0);

        setCarrito({ items, total });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("❌ Error al obtener el carrito:", err);
          setError("Error al conectar con el servidor.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarrito();
    return () => controller.abort();
  }, []);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!carrito || carrito.items.length === 0)
    return <p>No tienes productos en tu carrito.</p>;

  return (
    <div className="container mt-4">
      <h2>🛒 Mi Carrito</h2>

      {carrito.items.map((item) => {
        const prod = item?.producto || {};
        const img = getProductoImage(prod);
        return (
          <div key={item.item_id || `${prod.id}-${item.cantidad}`} className="card mb-2 p-3 shadow-sm">
            <div className="d-flex gap-3 align-items-start">
              <img
                src={img}
                alt={prod?.nombre || "Producto"}
                style={{ width: 120, height: 120, objectFit: "contain", borderRadius: 8, background: "#f8f9fa" }}
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x300?text=Sin+imagen";
                }}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1">{prod?.nombre || "Producto sin nombre"}</h5>
                {prod?.descripcion && <p className="mb-2 text-muted">{prod.descripcion}</p>}
                <div className="d-flex flex-wrap gap-3">
                  <span>Precio: <strong>{formatMoney(prod?.precio)}</strong></span>
                  <span>Cantidad: <strong>{item?.cantidad}</strong></span>
                  <span>Subtotal: <strong>{formatMoney(item?.subtotal)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="text-end mt-3">
        <h4>Total: {formatMoney(carrito.total)}</h4>
        <button className="btn btn-primary">Continuar</button>
      </div>
    </div>
  );
};