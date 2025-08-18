import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/compradores"; // Cambiado el endpoint

export const CompradoresLista = () => {
    // Estado para almacenar la lista de compradores
    const [compradores, setCompradores] = useState([]);
    // Estado para verificar si el usuario es un administrador
    const [isAdmin, setIsAdmin] = useState(false);
    // Estados para controlar el modal de confirmación de eliminación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [compradorToDelete, setCompradorToDelete] = useState(null);
    const navigate = useNavigate();

    // Obtener el ID del comprador logeado desde localStorage
    const getLoggedInCompradorId = () => {
        const compradorId = localStorage.getItem('compradorId');
        return compradorId ? JSON.parse(compradorId) : null;
    }

    const getCompradores = async (id = null) => {
        try {
            let res;
            if (id) {
                res = await fetch(`${API}/${id}`);
            } else {
                res = await fetch(API);
            }
            if (!res.ok) throw new Error("Error al obtener compradores");
            const data = await res.json();
            setCompradores(id ? [data] : data);
        } catch (err) {
            console.error("❌ Error al cargar compradores:", err.message);
        }
    };

    useEffect(() => {
        const tokenUserAdmin = localStorage.getItem('tokenUserAdmin');
        if (tokenUserAdmin) {
            setIsAdmin(true);
            getCompradores();
        } else {
            const compradorId = getLoggedInCompradorId();
            if (compradorId) {
                setIsAdmin(false);
                getCompradores(compradorId);
            } else {
                console.warn("No se encontró token de administrador ni ID de comprador.");
                setCompradores([]);
            }
        }
    }, []);

    const handleDelete = (id) => {
        setCompradorToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API}/${compradorToDelete}`, {
                method: "DELETE"
            });
            if (res.ok) {
                if(isAdmin){
                    getCompradores();
                } else {
                    getCompradores(getLoggedInCompradorId());
                }
            }
        } catch (err) {
            console.error("❌ Error al eliminar comprador:", err.message);
        } finally {
            setIsModalOpen(false);
            setCompradorToDelete(null);
        }
    };
    
    const handleNavigate = (path, id) => {
        const fullPath = isAdmin ? `/admin/compradores${path.replace(':id', id)}` : `/compradores${path.replace(':id', id)}`;
        navigate(fullPath);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {isAdmin ? "Lista de Compradores" : "Mis Datos de Comprador"}
            </h2>

            {/* Modal de confirmación */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <h3 className="text-xl font-bold mb-4">¿Estás seguro de que quieres eliminar este comprador?</h3>
                        <p className="text-gray-700 mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="overflow-x-auto">
                <table className="table table-bordered">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Correo</th>
                            <th className="py-3 px-4 text-left">Dirección</th> {/* Nuevo campo */}
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {compradores.length > 0 ? (
                            compradores.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-100 transition-colors duration-150">
                                    <td className="py-3 px-4">{c.id}</td>
                                    <td className="py-3 px-4">{c.username}</td>
                                    <td className="py-3 px-4">{c.correo}</td>
                                    <td className="py-3 px-4">{c.direccion || '-'}</td> {/* Nuevo campo */}
                                    <td className="py-3 px-4 flex justify-center space-x-2">
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleNavigate('/detalles/:id', c.id)}
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleNavigate('/editar/:id', c.id)}
                                        >
                                            Editar
                                        </button>
                                        {isAdmin && ( // Solo admin puede eliminar
                                            <button
                                                className="btn btn-danger btn-sm me-2"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-4 text-center text-gray-500">
                                    No se encontraron compradores.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 d-flex gap-3">
                {isAdmin && (
                    <Link
                        to="/admin/compradores/crear"
                        className="btn btn-success"
                    >
                        Crear Nuevo Comprador
                    </Link>
                )}
                <button
                    className="btn btn-secondary" 
                    onClick={() => navigate("/")}
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
};

export default CompradorLista;