import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const UserAdminForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            setLoading(true);
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/useradmin/${id}`)
                .then(res => res.json())
                .then(data => {
                    setForm({ email: data.email, password: "" });
                })
                .catch(err => setError("No se pudo cargar el administrador para editar."))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode
            ? `${import.meta.env.VITE_BACKEND_URL}/api/useradmin/${id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/useradmin`;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || `Error al ${isEditMode ? "editar" : "crear"} el administrador.`);
            }

            navigate("/useradmin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div className="text-center mt-5">Cargando datos del administrador...</div>;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2>{isEditMode ? "Editar Administrador" : "Crear Nuevo Administrador"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={isEditMode} // Opcional: deshabilitar la edición del email
                    />
                </div>
                <div className="mb-3">
                    <label>Contraseña {isEditMode && "(dejar en blanco para no cambiar)"}</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-control"
                        required={!isEditMode} // Requerir contraseña solo al crear
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Cargando..." : isEditMode ? "Guardar Cambios" : "Crear Administrador"}
                </button>
            </form>
        </div>
    );
};