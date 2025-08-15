import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const OrdenesUserAdminLista = () => {
    // Estado para almacenar la lista de órdenes (carritos que no están 'open')
    const [ordenes, setOrdenes] = useState([]);
    // Estado para manejar errores o mensajes
    const [mensaje, setMensaje] = useState("Cargando órdenes de compra...");
    
    // URL del backend. Por favor, reemplaza esta URL con la de tu propio backend.
      const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // useEffect se ejecuta cuando el componente se monta
    useEffect(() => {
        // Función asíncrona para obtener los datos del backend
        const fetchOrdenes = async () => {
            const token = localStorage.getItem("tokenUserAdmin");
            if (!token) {
                setMensaje("Acceso denegado. Se requiere iniciar sesión como administrador.");
                return;
            }

            try {
                // Hacemos la petición a la API para obtener todos los carritos
                const response = await fetch(`${VITE_BACKEND_URL}/api/carritos`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Enviamos el token para la autenticación
                    }
                });

                if (!response.ok) {
                    // Si la respuesta no es exitosa, lanzamos un error
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Filtramos los carritos en el lado del cliente para mostrar solo los que no están 'open'
                const ordenesNoAbiertas = data.filter(carrito => carrito.status !== 'open');

                // Si se reciben datos, los guardamos en el estado
                if (ordenesNoAbiertas.length > 0) {
                    setOrdenes(ordenesNoAbiertas);
                } else {
                    // Si no hay órdenes que no estén 'open'
                    setMensaje("No se encontraron órdenes de compra (carritos con estado diferente a 'open').");
                }

            } catch (error) {
                console.error("Error al obtener las órdenes:", error);
                setMensaje("Hubo un problema al cargar los datos. Revisa la consola para más detalles.");
            }
        };

        fetchOrdenes();
    }, []); // El array de dependencias vacío asegura que el efecto se ejecute solo una vez.

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Órdenes de Compra</h1>
            {ordenes.length > 0 ? (
                <ul className="list-group">
                    {ordenes.map((orden) => (
                        <li key={orden.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1">Orden ID: {orden.id}</h5>
                                <p className="mb-1">
                                    Comprador ID: {orden.comprador_id || "No asignado"}
                                </p>
                                <p className="mb-1">
                                    Estado: <span className="fw-bold">{orden.status}</span>
                                </p>
                            </div>
                            <Link to={`/user/admin/ordenes/detalles/${orden.id}`} className="btn btn-outline-info btn-sm">
                                Ver Detalles
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                // Si no hay órdenes, muestra el mensaje de estado
                <div className="alert alert-info" role="alert">
                    {mensaje}
                </div>
            )}
        </div>
    );
};
