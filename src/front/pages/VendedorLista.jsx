import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const VendedoresLista = () => {
    // Estado para almacenar la lista de vendedores
    const [vendedores, setVendedores] = useState([]);
    // Estado para verificar si el usuario es un administrador
    const [isAdmin, setIsAdmin] = useState(false);
    // Estados para controlar el modal de confirmación de eliminación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vendedorToDelete, setVendedorToDelete] = useState(null);
    const navigate = useNavigate();

    // Obtener el ID del vendedor logeado desde localStorage
    const getLoggedInVendedorId = () => {
        const vendedorId = localStorage.getItem('vendedorId');
        return vendedorId ? JSON.parse(vendedorId) : null;
    }

    const getVendedores = async (id = null) => {
        try {
            let res;
            if (id) {
                // Si hay un ID, obtenemos solo ese vendedor
                res = await fetch(`${API}/${id}`);
            } else {
                // Si no hay ID, obtenemos todos los vendedores (para admin)
                res = await fetch(API);
            }
            if (!res.ok) throw new Error("Error al obtener vendedores");
            const data = await res.json();
            
            // Si es un solo vendedor, lo ponemos en un array para que el map funcione
            setVendedores(id ? [data] : data);
        } catch (err) {
            console.error("❌ Error al cargar vendedores:", err.message);
        }
    };

    useEffect(() => {
        // Verificar si es administrador
        const tokenUserAdmin = localStorage.getItem('tokenUserAdmin');
        if (tokenUserAdmin) {
            setIsAdmin(true);
            getVendedores();
        } else {
            // Si no es admin, es un vendedor. Obtener su ID y sus datos.
            const vendedorId = getLoggedInVendedorId();
            if (vendedorId) {
                setIsAdmin(false);
                getVendedores(vendedorId);
            } else {
                // Si no hay token de admin ni ID de vendedor, no deberíamos mostrar nada
                console.warn("No se encontró token de administrador ni ID de vendedor.");
                setVendedores([]);
            }
        }
    }, []);

    const handleDelete = (id) => {
        setVendedorToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API}/${vendedorToDelete}`, {
                method: "DELETE"
            });
            if (res.ok) {
                // Volver a cargar la lista
                if(isAdmin){
                    getVendedores();
                } else {
                    getVendedores(getLoggedInVendedorId());
                }
                
            }
        } catch (err) {
            console.error("❌ Error al eliminar vendedor:", err.message);
        } finally {
            setIsModalOpen(false);
            setVendedorToDelete(null);
        }
    };
    
    // Función para manejar la navegación a los detalles y edición
    const handleNavigate = (path, id) => {
        const fullPath = isAdmin ? `/admin/vendedores${path.replace(':id', id)}` : `/vendedores${path.replace(':id', id)}`;
        navigate(fullPath);
    };


    return (
        <div className="container mt-5">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {isAdmin ? "Lista de Vendedores" : "Mis Datos de Vendedor"}
            </h2>

            {/* Modal de confirmación personalizado */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                        <h3 className="text-xl font-bold mb-4">¿Estás seguro de que quieres eliminar este vendedor?</h3>
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
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {vendedores.length > 0 ? (
                            vendedores.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-100 transition-colors duration-150">
                                    <td className="py-3 px-4">{v.id}</td>
                                    <td className="py-3 px-4">{v.username}</td>
                                    <td className="py-3 px-4">{v.correo}</td>
                                    <td className="py-3 px-4 flex justify-center space-x-2">
                                        <button
                                            className="btn btn-info btn-sm me-2"
                                            onClick={() => handleNavigate('/detalles/:id', v.id)}
                                        >
                                            Ver Detalles
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleNavigate('/editar/:id', v.id)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                             className="btn btn-danger btn-sm me-2"
                                            onClick={() => handleDelete(v.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500">
                                    No se encontraron vendedores.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 d-flex gap-3">
                {isAdmin && (
                    <Link
                        to="/admin/vendedores/crear"
                        className="btn btn-success"
                    >
                        Crear Nuevo Vendedor
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
