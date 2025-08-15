import { useEffect, useState } from "react";

export const VendedorPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ username: "", descripcion: "" });
  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const token = localStorage.getItem("tokenVendedor");

  const apiBase = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/vendedor/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data = await res.json();
        setPerfil(data);
        setForm({ username: data.username || "", descripcion: data.descripcion || "" });
      } catch (e) {
        alert("❌ " + e.message);
      }
    };
    load();
  }, [apiBase, token]);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const guardarDatos = async () => {
    try {
      const res = await fetch(`${apiBase}/api/vendedor/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al actualizar perfil");
      setPerfil(data);
      alert("✅ Datos actualizados");
    } catch (e) {
      alert("❌ " + e.message);
    }
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setArchivo(f || null);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const subirImagen = async (file) => {
    const token = localStorage.getItem("tokenVendedor");
    const fd = new FormData();
    fd.append("imagen", file);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vendedor/perfil/imagen`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // ¡NO pongas Content-Type!
      body: fd,
    });

    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json") ? await res.json() : await res.text();

    if (!res.ok) throw new Error(payload?.msg || payload || "Error subiendo imagen");
    return payload; // { msg, avatar_url }
  };

  if (!perfil) return <div className="container mt-4">Cargando perfil…</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2>Mi perfil</h2>

      <div className="card mt-3">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <img
              src={preview || (perfil.imagen_url ? `${apiBase}${perfil.imagen_url}` : "https://via.placeholder.com/120")}
              alt="avatar"
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "100%" }}
            />
            <div>
              <input type="file" accept="image/*" onChange={onFile} className="form-control mb-2" />
              <button className="btn btn-outline-primary" onClick={subirImagen} disabled={!archivo}>
                Subir imagen
              </button>
            </div>
          </div>

          <hr className="my-4" />

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input type="text" value={perfil.correo || ""} className="form-control" disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={onChange}
              className="form-control"
              rows="4"
              placeholder="Escribe algo sobre ti…"
            />
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={guardarDatos}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};