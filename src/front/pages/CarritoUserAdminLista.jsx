import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const CarritoUserAdminLista = () => {
    // Estado para almacenar la lista de carritos
    const [carritos, setCarritos] = useState([]);
    // Estado para manejar errores o mensajes
    const [mensaje, setMensaje] = useState("Cargando carritos abiertos...");

    // Asignamos la URL del backend a una variable
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // useEffect se ejecuta cuando el componente se monta
    useEffect(() => {
        // Función asíncrona para obtener los datos del backend
        const fetchCarritosAbiertos = async () => {
            const token = localStorage.getItem("tokenUserAdmin");
            if (!token) {
                setMensaje("Acceso denegado. Se requiere iniciar sesión como administrador.");
                return;
            }

            try {
                // Hacemos la petición a la API (sin filtro en la URL)
                const response = await fetch(`${VITE_BACKEND_URL}/api/carritos?estado=open`, {
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

                // Filtramos los carritos en el lado del cliente para mostrar solo los 'open'
                const carritosAbiertos = data.filter(carrito => carrito.status === 'open');

                // Si se reciben datos, los guardamos en el estado
                if (carritosAbiertos.length > 0) {
                    setCarritos(carritosAbiertos);
                } else {
                    // Si no hay carritos abiertos
                    setMensaje("No se encontraron carritos con estado 'open'.");
                }

            } catch (error) {
                console.error("Error al obtener los carritos:", error);
                setMensaje("Hubo un problema al cargar los datos. Revisa la consola para más detalles.");
            }
        };

        fetchCarritosAbiertos();
    }, [VITE_BACKEND_URL]); // Agregamos la URL a las dependencias

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Carritos de Compra Abiertos</h1>
            {carritos.length > 0 ? (
                <ul className="list-group">
                    {carritos.map((carrito) => (
                        <li key={carrito.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1">Carrito ID: {carrito.id}</h5>
                                <p className="mb-1">  Comprador ID: {carrito.comprador_id || "No asignado"} </p>
                                <p className="mb-1">   Comprador: {carrito.comprador?.username || `ID: ${carrito.comprador_id}` || "No asignado"} </p>
                            </div>
                            <Link to={`/user/admin/carritos/detalles/${carrito.id}`} className="btn btn-primary btn-sm">
                                Ver Detalles
                            </Link>

                        </li>
                    ))}
                </ul>
            ) : (
                // Si no hay carritos, muestra el mensaje de estado
                <div className="alert alert-info" role="alert">
                    {mensaje}
                </div>
            )}
        </div>
    );
};
