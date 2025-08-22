import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

export const CompradorProcesarOrden = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(state?.carrito || null);
  const [itemsData, setItemsData] = useState([]); // [{item_id, producto, cantidad, form:{...}, saved:boolean}]
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]); // solo para el ítem seleccionado

  // refs del mapa único
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Helpers
  const formatMoney = (n) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(n || 0));

  const toAbsoluteUrl = (src) => {
    if (!src) return null;
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
    return `${base}${src.startsWith("/") ? "" : "/"}${src}`;
  };

  const getProductoImage = (p) => {
    const raw = p?.imageUrl || p?.imagen_url || p?.imagen || null;
    return toAbsoluteUrl(raw) || "https://placehold.co/400x300?text=Sin+imagen";
  };

  // Construye estructura local de items
  const bootstrapItems = (carri) => {
    const arr = (carri?.items || []).map((it) => ({
      item_id: it.item_id,
      cantidad: it.cantidad,
      producto: it.producto,
      form: {
        direccion: "",
        detalle: "",
        latitud: "40.4168",
        longitud: "-3.7038",
      },
      saved: false,
      loading: false,
    }));
    setItemsData(arr);
  };

  // Cargar carrito (si no vino por state) + pre-cargar direcciones
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        let localCarrito = state?.carrito || null;

        if (!localCarrito) {
          const token = localStorage.getItem("tokenComprador");
          if (!token) {
            setError("Debes iniciar sesión como comprador.");
            setLoading(false);
            return;
          }
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/comprador/carrito/items`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            setError((data && (data.msg || data.error)) || "Error al obtener el carrito");
            setLoading(false);
            return;
          }
          const carritoId = data?.id || Date.now();
          localCarrito = { id: carritoId, items: data.items || [], total: Number(data.total || 0) };
        }

        setCarrito(localCarrito);
        bootstrapItems(localCarrito);
      } catch (e) {
        console.error(e);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pre-cargar direcciones existentes por ítem (GET)
  useEffect(() => {
    const fetchExisting = async () => {
      const token = localStorage.getItem("tokenComprador");
      if (!token || itemsData.length === 0) return;

      try {
        const updated = await Promise.all(
          itemsData.map(async (it) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/comprador/orden/${it.item_id}/direccion`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.ok) {
                const d = await res.json();
                return {
                  ...it,
                  form: {
                    direccion: d.direccion || "",
                    detalle: d.detalle || "",
                    latitud: d.latitud || "40.4168",
                    longitud: d.longitud || "-3.7038",
                  },
                  saved: !!d?.direccion,
                };
              }
            } catch {}
            return it;
          })
        );
        setItemsData(updated);
      } catch (err) {
        console.error("❌ Error precargando direcciones:", err);
      }
    };
    fetchExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsData.length]);

  // ---- MAPA: sincroniza con el ítem seleccionado ----
  const currentForm = itemsData[selectedIdx]?.form || {
    latitud: "40.4168",
    longitud: "-3.7038",
  };
  const lat = useMemo(() => {
    const n = parseFloat(currentForm.latitud);
    return Number.isFinite(n) ? n : 40.4168;
  }, [currentForm.latitud]);
  const lon = useMemo(() => {
    const n = parseFloat(currentForm.longitud);
    return Number.isFinite(n) ? n : -3.7038;
  }, [currentForm.longitud]);

 // Init mapa (solo 1 vez) — espera a que exista el contenedor y no esté cargando
useEffect(() => {
  if (!MAPBOX_TOKEN) return;
  if (loading) return;                //  no crear el mapa mientras la UI muestra "Cargando…"
  if (mapRef.current) return;     
  const el = mapContainerRef.current;
  if (!el) return;                   

  const map = new mapboxgl.Map({
    container: el,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lon, lat],
    zoom: 12,
  });
  mapRef.current = map;

  const marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([lon, lat])
    .addTo(map);
  markerRef.current = marker;

  const onDragEnd = () => {
    const { lng, lat } = marker.getLngLat();
    setItemsData((prev) => {
      const copy = [...prev];
      copy[selectedIdx] = {
        ...copy[selectedIdx],
        form: { ...copy[selectedIdx].form, latitud: String(lat), longitud: String(lng) },
      };
      return copy;
    });
  };

  const onMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    marker.setLngLat([lng, lat]);
    setItemsData((prev) => {
      const copy = [...prev];
      copy[selectedIdx] = {
        ...copy[selectedIdx],
        form: { ...copy[selectedIdx].form, latitud: String(lat), longitud: String(lng) },
      };
      return copy;
    });
  };

  marker.on("dragend", onDragEnd);
  map.on("click", onMapClick);

  return () => {
    try { marker.off("dragend", onDragEnd); } catch {}
    try { map.off("click", onMapClick); } catch {}
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    markerRef.current = null;
  };

}, [MAPBOX_TOKEN, loading]); 

  // Cuando cambia el seleccionado o sus coords → centra mapa
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLngLat([lon, lat]);
    mapRef.current.flyTo({ center: [lon, lat], zoom: 14, essential: true });
  }, [selectedIdx, lat, lon]);

  // Handlers de inputs/autocomplete del ítem seleccionado
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setItemsData((prev) => {
      const copy = [...prev];
      copy[selectedIdx] = { ...copy[selectedIdx], form: { ...copy[selectedIdx].form, [name]: value } };
      return copy;
    });

    if (name === "direccion" && value.length >= 3 && MAPBOX_TOKEN) {
      try {
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json` +
          `?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (err) {
        console.error("❌ Error buscando lugares:", err);
      }
    }
  };

  const handleSuggestionClick = (place) => {
    const [lng, lat] = place.geometry.coordinates;
    setItemsData((prev) => {
      const copy = [...prev];
      copy[selectedIdx] = {
        ...copy[selectedIdx],
        form: {
          ...copy[selectedIdx].form,
          direccion: place.place_name,
          latitud: String(lat),
          longitud: String(lng),
        },
      };
      return copy;
    });
    setSuggestions([]);
  };

  // Guardar solo el ítem seleccionado
  const handleGuardarItem = async () => {
    const token = localStorage.getItem("tokenComprador");
    if (!token) return alert("❌ Debes iniciar sesión como comprador.");

    const it = itemsData[selectedIdx];
    if (!it) return;

    try {
      setItemsData((prev) => {
        const copy = [...prev];
        copy[selectedIdx] = { ...copy[selectedIdx], loading: true };
        return copy;
      });

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/comprador/orden/${it.item_id}/direccion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(it.form),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || "Error al guardar dirección");
      }
      setItemsData((prev) => {
        const copy = [...prev];
        copy[selectedIdx] = { ...copy[selectedIdx], saved: true, loading: false };
        return copy;
      });
      alert("✅ Dirección guardada para el ítem.");
    } catch (err) {
      console.error(err);
      setItemsData((prev) => {
        const copy = [...prev];
        copy[selectedIdx] = { ...copy[selectedIdx], loading: false };
        return copy;
      });
      alert("❌ " + err.message);
    }
  };

  // Guardar todos y pasar a checkout
  const handleGuardarTodasYPagar = async () => {
    const token = localStorage.getItem("tokenComprador");
    if (!token) return alert("❌ Debes iniciar sesión como comprador.");
    if (!carrito) return;

    try {
      for (let i = 0; i < itemsData.length; i++) {
        const it = itemsData[i];
        if (!it?.form?.direccion) {
          setSelectedIdx(i);
          return alert(`Falta la dirección para: ${it?.producto?.nombre || "ítem " + it?.item_id}`);
        }
      }

      // Guardar en serie (podemos paralelizar si quieres)
      for (let i = 0; i < itemsData.length; i++) {
        const it = itemsData[i];
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/comprador/orden/${it.item_id}/direccion`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(it.form),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.msg || `Error guardando dirección para ítem ${it.item_id}`);
        }
      }

      alert("✅ Direcciones guardadas. Procediendo al pago…");
      // Ajusta esta ruta si tu Checkout espera otro path
      navigate(`/checkout/${carrito.id}`, { state: { carrito } });
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="container mt-4">
        <h2>Procesar direcciones del carrito</h2>
        <div className="alert alert-danger">
          Falta <code>VITE_MAPBOX_TOKEN</code>. Revisa tu <code>.env</code>.
        </div>
      </div>
    );
  }

  if (loading) return <p className="container mt-4">Cargando…</p>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!carrito || !itemsData.length)
    return <p className="container mt-4">No hay ítems en el carrito.</p>;

  const sel = itemsData[selectedIdx];
  const prodSel = sel?.producto || {};

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Procesar direcciones del carrito</h2>
      <div className="row">
        {/* Lista de ítems */}
        <div className="col-md-5">
          <ul className="list-group">
            {itemsData.map((it, i) => (
              <li
                key={it.item_id}
                className={`list-group-item d-flex align-items-center justify-content-between ${i===selectedIdx ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => { setSelectedIdx(i); setSuggestions([]); }}
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={getProductoImage(it.producto)}
                    alt={it.producto?.nombre || "Producto"}
                    style={{ width: 45, height: 45, objectFit: "contain", borderRadius: 6, background: "#f8f9fa" }}
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300?text=Sin+imagen")}
                  />
                  <div>
                    <div className="fw-semibold">
                      {it.producto?.nombre || `Ítem ${it.item_id}`}
                    </div>
                    <small className="text-muted">
                      Cant: {it.cantidad} · Subtotal: {formatMoney((it.producto?.precio || 0) * it.cantidad)}
                    </small>
                  </div>
                </div>
                {it.saved && <span className="badge bg-success">✓</span>}
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <div className="fw-bold">Total:</div>
              <div className="fw-bold">{formatMoney(carrito.total)}</div>
            </div>
          </div>
        </div>

        {/* Panel del ítem seleccionado */}
        <div className="col-md-7">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">
              Dirección para: {prodSel?.nombre || `Ítem ${sel?.item_id}`}
            </h5>

            <div className="mb-3 position-relative">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={sel?.form?.direccion || ""}
                onChange={handleChange}
                className="form-control"
                autoComplete="off"
                required
              />
              {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100" style={{ zIndex: 10 }}>
                  {suggestions.map((place) => (
                    <li
                      key={place.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleSuggestionClick(place)}
                      style={{ cursor: "pointer" }}
                    >
                      {place.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Detalle</label>
              <textarea
                name="detalle"
                value={sel?.form?.detalle || ""}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Latitud</label>
                <input
                  type="text"
                  name="latitud"
                  value={sel?.form?.latitud || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Longitud</label>
                <input
                  type="text"
                  name="longitud"
                  value={sel?.form?.longitud || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: 320, borderRadius: 8, overflow: "hidden", marginBottom: "1rem" }}
            />

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={handleGuardarItem}
                disabled={sel?.loading}
              >
                {sel?.loading ? "Guardando..." : "Guardar este ítem"}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleGuardarTodasYPagar}
              >
                Guardar y pagar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/mi-carrito")}
              >
                Volver al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CompradorProcesarOrden;