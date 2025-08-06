import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/admins";

export const AdminDetalle = () => {
	const { id } = useParams();
	const [admin, setAdmin] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAdmin = async () => {
			try {
				const res = await fetch(`${API}/${id}`);
				if (!res.ok) throw new Error("Error al obtener detalles");
				const data = await res.json();
				setAdmin(data);
			} catch (err) {
				console.error("❌ Error al cargar detalles:", err.message);
			}
		};

		fetchAdmin();
	}, [id]);

	if (!admin) return <p>Cargando detalles...</p>;

	return (
		<div className="container mt-5">
			<h2>Detalles del Administrador</h2>
			<ul className="list-group">
				<li className="list-group-item"><strong>ID:</strong> {admin.id}</li>
				<li className="list-group-item"><strong>Nombre:</strong> {admin.username}</li>
				<li className="list-group-item"><strong>Correo:</strong> {admin.correo}</li>
			</ul>
			<button className="btn btn-secondary mt-3" onClick={() => navigate("/admins")}>
				Volver a la lista
			</button>
		</div>
	);
};
