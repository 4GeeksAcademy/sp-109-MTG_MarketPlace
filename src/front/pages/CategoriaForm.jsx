import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = "https://crispy-space-waddle-r4w7jx4g69rgfx5wj-3001.app.github.dev/api/categorias";

export const CategoriaForm = () => {
	const [form, setForm] = useState({ name: "" });
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const { id } = useParams();
	const editing = Boolean(id);

	useEffect(() => {
		if (editing) {
			fetch(`${API}/${id}`)
				.then((res) => res.json())
				.then((data) => setForm({ name: data.name }))
				.catch((err) => console.error("❌ Error al cargar categoría:", err));
		}
	}, [id]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(editing ? `${API}/${id}` : API, {
				method: editing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				const data = await res.json();
				setError(data.msg || "Error al enviar formulario");
				return;
			}

			navigate("/categorias");
		} catch (err) {
			console.error("❌ Error al enviar:", err.message);
			setError(err.message);
		}
	};

	return (
		<div className="container mt-4">
			<h3>{editing ? "Editar Categoría" : "Crear Nueva Categoría"}</h3>

			{error && <div className="alert alert-danger">{error}</div>}

			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label>Nombre de la Categoría</label>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						className="form-control"
						required
					/>
				</div>

				<div className="d-flex gap-2">
					<button className="btn btn-success" type="submit">
						{editing ? "Guardar cambios" : "Crear categoría"}
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => navigate("/categorias")}
					>
						Volver a la lista
					</button>
				</div>
			</form>
		</div>
	);
};
