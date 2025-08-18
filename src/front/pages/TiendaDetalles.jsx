import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const TiendaDetalles = () => {
  const [producto, setProducto] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error al obtener el producto: ${res.status}`);
        }
        return res.json();
      })
      .then(setProducto)
      .catch((err) => {
        console.error("❌ Error al obtener producto:", err);
        setProducto(null);
      });
  }, [id]);

  // 🟢 Función simple para navegar al login de compradores
  const handleComprarClick = () => {
    navigate("/compradores/login");
  };

  if (!producto) {
    return <div className="container mt-4">Cargando detalles del producto...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row g-0">
        <div className="col-md-6">
          <img
            src={producto.imageUrl || "https://placehold.co/400x400?text=Sin+imagen"}
            className="img-fluid rounded-start"
            alt={producto.nombre}
            style={{ objectFit: "contain", maxHeight: "400px", width: "100%" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x400?text=Imagen+no+disponible";
            }}
          />
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h1 className="card-title">{producto.nombre}</h1>
            <p className="card-text">
              <small className="text-muted">ID: {producto.id}</small>
            </p>
            <hr />
            <p className="card-text">
              <strong>Descripción:</strong> {producto.descripcion || "Sin descripción."}
            </p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Precio:</strong> ${producto.precio}
              </li>
              <li className="list-group-item">
                <strong>Rareza:</strong> {producto.rarity}
              </li>
              <li className="list-group-item">
                <strong>Tipo:</strong> {producto.type}
              </li>
              <li className="list-group-item">
                <strong>Vendedor ID:</strong> {producto.vendedor_id}
              </li>
            </ul>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/tienda")}
              >
                Volver a la tienda
              </button>
              {/* 🟢 Botón que siempre navega a /compradores/login 🟢 */}
              <button
                className="btn btn-success"
                onClick={() =>navigate("/compradores/login")}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};