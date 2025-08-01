import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api";

export const CompradorDetalle = () => {
  const { id } = useParams();
  const [comprador, setComprador] = useState(null);
  const [carritos, setCarritos] = useState([]);
  const navigate = useNavigate();

  const getComprador = async () => {
    try {
      const res = await fetch(`${API}/compradores/${id}`);
      if (!res.ok) throw new Error("Comprador no encontrado");
      const data = await res.json();
      setComprador(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getCarritos = async () => {
    try {
      const res = await fetch(`${API}/carritos`);
      if (!res.ok) throw new Error("Error al cargar carritos");
      const allCarritos = await res.json();
      const carritosDelComprador = allCarritos.filter(c => c.id_comprador === parseInt(id));
      setCarritos(carritosDelComprador);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getComprador();
    getCarritos();
  }, []);

  return (
    <div className="container mt-4">
      <button onClick={() => navigate("/compradores")} className="btn btn-secondary mb-3">
        ← Volver
      </button>

      {comprador ? (
        <>
          <h2>Detalles del Comprador</h2>
          <p><strong>ID:</strong> {comprador.id}</p>
          <p><strong>Nombre:</strong> {comprador.username}</p>
          <p><strong>Correo:</strong> {comprador.correo}</p>

          <h4 className="mt-4">Carritos del Comprador</h4>
          {carritos.length === 0 ? (
            <p>No hay carritos.</p>
          ) : (
            carritos.map(carrito => (
              <div key={carrito.id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">Carrito #{carrito.id}</h5>
                  <p><strong>Status:</strong> {carrito.status}</p>

                  <h6>Ítems en este carrito:</h6>
                  <CarritoItems carritoId={carrito.id} />
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Cargando comprador...</p>
      )}
    </div>
  );
};

const CarritoItems = ({ carritoId }) => {
  const [items, setItems] = useState([]);
  const [productos, setProductos] = useState({});

  const getItems = async () => {
    try {
      const res = await fetch(`${API}/itemcarrito`);
      const data = await res.json();
      const filtered = data.filter(item => item.carrito_id === carritoId);
      setItems(filtered);

      const productoIds = [...new Set(filtered.map(item => item.producto_id))];
      for (let id of productoIds) {
        const pRes = await fetch(`${API}/productos/${id}`);
        const pData = await pRes.json();
        setProductos(prev => ({ ...prev, [id]: pData }));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <ul className="list-group">
      {items.length === 0 ? (
        <li className="list-group-item">Sin ítems.</li>
      ) : (
        items.map(item => (
          <li key={item.id} className="list-group-item">
            Producto: {productos[item.producto_id]?.nombre || "Cargando..."} <br />
            Cantidad: {item.cantidad}
          </li>
        ))
      )}
    </ul>
  );
};