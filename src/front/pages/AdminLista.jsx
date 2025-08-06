import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/admins";

export const AdminLista = () => {
	const [admins, setAdmins] = useState([]);
	const navigate = useNavigate();

	const getAdmins = async () => {
		try {
			const res = await fetch(API);
			if (!res.ok) throw new Error("Error al obtener admins");
			const data = await res.json();
			setAdmins(data);
		} catch (err) {
			console.error("❌ Error al cargar admins:", err.message);
		}
	};

	useEffect(() => {
		getAdmins();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("¿Eliminar admin?")) return;
		try {
			const res = await fetch(`${API}/${id}`, { method: "DELETE" });
			if (res.ok) getAdmins();
		} catch (err) {
			console.error("❌ Error al eliminar admin:", err.message);
		}
	};

	return (
		<div className="container mt-5">
			<h2 className="mb-4">Lista de Administradores</h2>

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
					{admins.map((a) => (
						<tr key={a.id}>
							<td>{a.id}</td>
							<td>{a.username}</td>
							<td>{a.correo}</td>
							<td>
								<button
									className="btn btn-info btn-sm me-2"
									onClick={() => navigate(`/admins/${a.id}/detalles`)}
								>
									Detalles
								</button>
								<button
									className="btn btn-warning btn-sm me-2"
									onClick={() => navigate(`/admins/editar/${a.id}`)}
								>
									Editar
								</button>
								<button
									className="btn btn-danger btn-sm"
									onClick={() => handleDelete(a.id)}
								>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="mt-4 d-flex gap-3">
				<Link to="/admins/crear" className="btn btn-success">
					Crear Admin
				</Link>
				<button className="btn btn-secondary" onClick={() => navigate("/")}>
					Volver al Inicio
				</button>
			</div>
		</div>
	);
};
