import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export const UserAdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/useradmin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || "Error en el login");
                return;
            }

            // Guardar token y datos en localStorage para sesión admin
            localStorage.setItem("tokenUserAdmin", data.token);
            localStorage.setItem("userAdminEmail", data.email);
            localStorage.setItem("userAdminId", data.id);

            const destino = location.state?.from?.pathname || "/useradmin";
            navigate(destino, { replace: true });
        } catch (err) {
            console.error("❌ Error de conexión:", err);
            setError("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2>Iniciar sesión como Administrador</h2>
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
                    />
                </div>

                <div className="mb-3">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button className="btn btn-primary w-100">Iniciar Sesión</button>
            </form>
        </div>
    );
};