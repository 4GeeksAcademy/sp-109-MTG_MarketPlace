import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const UserAdminLista = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/useradmin`);
            if (!res.ok) {
                throw new Error("No se pudo obtener la lista de administradores");
            }
            const data = await res.json();
            setAdmins(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este administrador?")) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/useradmin/${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    throw new Error("Error al eliminar el administrador");
                }
                // Actualizar la lista después de eliminar
                fetchAdmins();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando administradores...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Lista de Administradores</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link to="/useradmin/register" className="btn btn-primary">
                    Nuevo Administrador
                </Link>
            </div>
            {admins.length === 0 ? (
                <div className="alert alert-info">No hay administradores registrados.</div>
            ) : (
                <ul className="list-group">
                    {admins.map(admin => (
                        <li
                            key={admin.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <h5 className="mb-1">{admin.email}</h5>
                            </div>
                            <div>
                                <Link to={`/useradmin/${admin.id}/detalles`} className="btn btn-info btn-sm me-2">
                                    Ver detalles
                                </Link>
                                <Link to={`/useradmin/editar/${admin.id}`} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(admin.id)}
                                    className="btn btn-danger btn-sm"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};