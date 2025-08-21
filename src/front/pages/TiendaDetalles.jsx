import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Tiendas.css"; // Asegúrate de que la clase .gothic-font esté aquí

export const TiendaDetalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  const API_PRODUCTO = import.meta.env.VITE_BACKEND_URL + `/api/productos/${id}`;
  const API_CARRITOS = import.meta.env.VITE_BACKEND_URL + "/api/carritos";
  const API_ITEM_CARRITO = import.meta.env.VITE_BACKEND_URL + "/api/itemcarrito";

  const token = localStorage.getItem("tokenComprador");
  const compradorId = localStorage.getItem("compradorId");

  useEffect(() => {
    fetch(API_PRODUCTO)
      .then(res => res.ok ? res.json() : Promise.reject("Error al cargar producto"))
      .then(setProducto)
      .catch(err => {
        console.error("❌", err);
        setProducto(null);
      });
  }, [id]);

  const handleAgregarAlCarrito = async () => {
    if (!token || !compradorId) {
      navigate("/comprador/login");
      return;
    }

    try {
      const resCarritos = await fetch(`${API_CARRITOS}?id_comprador=${compradorId}&status=open`);
      if (!resCarritos.ok) throw new Error("No se pudo obtener el carrito");
      let [carritoActivo] = await resCarritos.json();

      if (!carritoActivo) {
        const resNuevoCarrito = await fetch(API_CARRITOS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_comprador: Number(compradorId), status: "open" }),
        });
        if (!resNuevoCarrito.ok) throw new Error("No se pudo crear el carrito");
        carritoActivo = await resNuevoCarrito.json();
      }

      const resItem = await fetch(API_ITEM_CARRITO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrito_id: carritoActivo.id,
          producto_id: producto.id,
          cantidad: 1
        }),
      });

      if (!resItem.ok) throw new Error("No se pudo agregar el producto al carrito");
      alert("✅ Producto agregado al carrito correctamente");
    } catch (err) {
      console.error("❌ Error al agregar al carrito:", err);
      alert("Error al agregar el producto al carrito.");
    }
  };

  if (!producto) return <div className="container mt-4">Cargando detalles del producto...</div>;

  return (
    <div className="container mt-4">
      <div className="row g-0">
        <div className="col-md-6">
          <img
            src={producto.imageUrl || "https://placehold.co/400x400?text=Sin+imagen"}
            className="img-fluid rounded-start tienda-detalles-img"
            alt={producto.nombre}
            style={{ objectFit: "contain", maxHeight: "400px", width: "100%" }}
          />
        </div>
        <div className="col-md-6">
          <div className="card-body">
            {/* Nombre con letra gótica */}
            <h1 className="card-title gothic-font">{producto.nombre}</h1>
            <hr />
            <p><strong>Descripción:</strong> {producto.descripcion || "Sin descripción."}</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"><strong>Precio:</strong> ${producto.precio}</li>
              <li className="list-group-item"><strong>Rareza:</strong> {producto.rarity}</li>
              <li className="list-group-item"><strong>Tipo:</strong> {producto.type}</li>
            </ul>
            <div className="d-flex justify-content-between align-items-center mt-4">
              {/* Botones con letra gótica */}
              <button className="btn btn-secondary gothic-font" onClick={() => navigate("/tienda")}>
                Volver a la tienda
              </button>
              <button className="btn btn-success gothic-font" onClick={handleAgregarAlCarrito}>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
