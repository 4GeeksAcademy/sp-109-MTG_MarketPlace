// src/front/pages/VendedorPerfil.jsx
import { useEffect, useMemo, useState } from "react";

// Placeholder inline (sin llamadas externas). Se usa si no hay imagen.
const AVATAR_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop stop-color='#e5e7eb' offset='0%'/><stop stop-color='#d1d5db' offset='100%'/>
        </linearGradient>
      </defs>
      <rect width='128' height='128' rx='16' fill='url(#g)'/>
      <circle cx='64' cy='48' r='24' fill='#9ca3af'/>
      <rect x='24' y='82' width='80' height='30' rx='15' fill='#9ca3af'/>
    </svg>`
  );

export default function VendedorPerfil() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const token = useMemo(() => localStorage.getItem("tokenVendedor"), []);
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const [perfil, setPerfil] = useState(null);
  const [username, setUsername] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ===== Helpers =====
  const withApiBase = (maybeRelativeUrl) => {
    if (!maybeRelativeUrl) return null;
    return maybeRelativeUrl.startsWith("http")
      ? maybeRelativeUrl
      : `${API}${maybeRelativeUrl}`;
  };

  const avatarSrc =
    preview || withApiBase(perfil?.imagen_url) || AVATAR_PLACEHOLDER;

  // ===== Cargar perfil =====
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        if (!token) throw new Error("No hay sesión de vendedor (token faltante).");
        const res = await fetch(`${API}/api/vendedor/perfil`, {
          headers: { ...authHeader },
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = data?.msg || `Error ${res.status} al cargar perfil`;
          throw new Error(msg);
        }

        if (!abort) {
          setPerfil(data);
          setUsername(data.username || "");
          setDescripcion(data.descripcion || "");
        }
      } catch (e) {
        alert("❌ " + e.message);
      } finally {
        if (!abort) setLoadingPerfil(false);
      }
    })();
    return () => {
      abort = true;
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API, token]);

  // ===== Guardar datos texto =====
  const guardarPerfil = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API}/api/vendedor/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        body: JSON.stringify({ username, descripcion }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.msg || `Error ${res.status} al actualizar perfil`;
        throw new Error(msg);
      }

      // algunos backends devuelven { msg } y otros el perfil completo;
      // aquí soportamos ambos sin romper nada de lo que ya tenías:
      setPerfil((p) => ({
        ...(p || {}),
        username,
        descripcion,
        // si el backend devolvió campos frescos, se mezclan:
        ...data,
      }));

      alert("✅ Datos actualizados");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setSaving(false);
    }
  };

  // ===== Selección de imagen =====
  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validaciones suaves (no rompen el flujo)
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
    if (!allowed.includes(f.type)) {
      alert("⚠️ Formato no permitido. Usa PNG, JPG, GIF o WEBP.");
      return;
    }
    const MAX_MB = 3;
    if (f.size > MAX_MB * 1024 * 1024) {
      alert(`⚠️ La imagen supera ${MAX_MB}MB.`);
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // ===== Subir imagen =====
  const subirImagen = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("imagen", file);

      const res = await fetch(`${API}/api/vendedor/perfil/imagen`, {
        method: "POST",
        headers: { ...authHeader }, // NO poner Content-Type aquí
        body: fd,
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const msg =
          (typeof payload === "object" && payload?.msg) ||
          (typeof payload === "string" ? payload : "Error subiendo imagen");
        throw new Error(msg);
      }

      // Esperamos { imagen_url: "/static/avatars/vendedor_X.png" }
      const nuevaUrl =
        typeof payload === "object" ? payload?.imagen_url : null;

      if (nuevaUrl) {
        setPerfil((p) => ({ ...(p || {}), imagen_url: nuevaUrl }));
      }
      // limpiar preview/archivo
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);

      alert("✅ Imagen actualizada");
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setUploading(false);
    }
  };

  // ===== UI =====
  if (loadingPerfil) {
    return (
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border" role="status" />
          <span>Cargando perfil…</span>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          No fue posible cargar el perfil.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2 className="mb-3">Mi perfil</h2>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* Avatar + carga de imagen */}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <img
              src={avatarSrc}
              alt="avatar"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: "100%",
                border: "1px solid #e5e7eb",
              }}
            />
            <div style={{ minWidth: 260, maxWidth: 360 }}>
              <label className="form-label">Foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="form-control mb-2"
              />
              <button
                className="btn btn-outline-primary w-100"
                onClick={subirImagen}
                disabled={!file || uploading}
              >
                {uploading ? "Subiendo…" : "Subir imagen"}
              </button>
              {file && (
                <small className="text-muted d-block mt-1">
                  Archivo: {file.name}
                </small>
              )}
            </div>
          </div>

          <hr className="my-4" />

          {/* Campos de texto */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Usuario</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre público"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Correo</label>
              <input
                className="form-control"
                value={perfil.correo || ""}
                disabled
              />
            </div>

            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escribe algo sobre ti…"
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={guardarPerfil}
              disabled={saving}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}