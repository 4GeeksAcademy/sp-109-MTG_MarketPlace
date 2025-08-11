import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export const UserAdminDetalle = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/useradmin/${id}`);
        if (!res.ok) {
          throw new Error("No se pudo obtener el usuario administrador");
        }
        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!admin) {
    return <div className="alert alert-warning mt-5">Usuario administrador no encontrado.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2>Detalles del Administrador</h2>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>ID:</strong> {admin.id}
          </p>
          <p className="card-text">
            <strong>Email:</strong> {admin.email}
          </p>
        </div>
        <div className="card-footer">
          <Link to="/useradmin" className="btn btn-secondary me-2">
            Volver a la lista
          </Link>
          <Link to={`/useradmin/editar/${admin.id}`} className="btn btn-warning">
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
};