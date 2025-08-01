import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const VendedorDetalle = () => {
	const { id } = useParams();
	const [vendedor, setVendedor] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchVendedor = async () => {
			try {
				const res = await fetch(`${API}/${id}`);
				if (!res.ok) throw new Error("Error al obtener detalles");
				const data = await res.json();
				setVendedor(data);
			} catch (err) {
				console.error("❌ Error al cargar detalles:", err.message);
			}
		};

		fetchVendedor();
	}, [id]);

	if (!vendedor) return <p>Cargando detalles...</p>;

	return (
		<div className="container mt-5">
			<h2>Detalles del Vendedor</h2>
			<ul className="list-group">
				<li className="list-group-item"><strong>ID:</strong> {vendedor.id}</li>
				<li className="list-group-item"><strong>Nombre:</strong> {vendedor.username}</li>
				<li className="list-group-item"><strong>Correo:</strong> {vendedor.correo}</li>
			</ul>
			<button className="btn btn-secondary mt-3" onClick={() => navigate("/vendedores")}>
				Volver a la lista
			</button>
		</div>
	);
};