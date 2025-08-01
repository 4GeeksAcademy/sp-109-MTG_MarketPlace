import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/vendedores";

export const VendedoresLista = () => {
	const [vendedores, setVendedores] = useState([]);
	const navigate = useNavigate();

	const getVendedores = async () => {
		try {
			const res = await fetch(API);
			if (!res.ok) throw new Error("Error al obtener vendedores");
			const data = await res.json();
			setVendedores(data);
		} catch (err) {
			console.error("❌ Error al cargar vendedores:", err.message);
		}
	};

	useEffect(() => {
		getVendedores();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("¿Eliminar vendedor?")) return;
		try {
			const res = await fetch(`${API}/${id}`, { method: "DELETE" });
			if (res.ok) getVendedores();
		} catch (err) {
			console.error("❌ Error al eliminar vendedor:", err.message);
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Lista de Vendedores</h2>

			<table className="table table-bordered">
				<thead>
					<tr>
						<th>ID</th>
						<th>Nombre</th>
						<th>Correo</th>
						<th>Acciones</th>
					</tr>
				</thead>
					<tbody>
					{vendedores.map((v) => (
						<tr key={v.id}>
							<td>{v.id}</td>
							<td>{v.username}</td>
							<td>{v.correo}</td>
							<td>
								<button
									className="btn btn-info btn-sm me-2"
									onClick={() => navigate(`/vendedores/${v.id}/detalles`)}
								>
									Detalles
								</button>
								<button
									className="btn btn-warning btn-sm me-2"
									onClick={() => navigate(`/vendedores/editar/${v.id}`)}
								>
									Editar
								</button>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => handleDelete(v.id)}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* 🔽 Botones debajo de la tabla */}
			<div className="mt-4 d-flex gap-3">
				<Link to="/vendedores/crear" className="btn btn-success">
					Crear Vendedor
				</Link>
				<button className="btn btn-secondary" onClick={() => navigate("/")}>
					Volver al Inicio
				</button>
			</div>
		</div>
	);
};