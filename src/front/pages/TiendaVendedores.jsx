import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_VENDEDORES = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const TiendaVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const res = await fetch(API_VENDEDORES);
        const data = await res.json();
        setVendedores(data || []);
      } catch (err) {
        console.error("Error al obtener vendedores:", err);
        setVendedores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendedores();
  }, []);

  if (loading) return <p className="text-center">Cargando vendedores…</p>;
  if (vendedores.length === 0) return <p className="text-center text-muted">No hay vendedores disponibles.</p>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Tienda de Vendedores</h1>
      <div className="d-flex flex-wrap justify-content-center gap-4">
        {vendedores.map(v => (
          <div key={v.id} className="card" style={{ width: "18rem" }}>
            <img
              src={v.imagen || "https://placehold.co/400x300?text=Sin+imagen"}
              className="card-img-top"
              alt={v.username}
              style={{ objectFit: "cover", height: "200px", width: "100%" }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{v.username}</h5>
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate(`/tienda/vendedores/${v.id}`)}
              >
                Ver Cartas
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
