import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";


const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

mapboxgl.accessToken = MAPBOX_TOKEN;

export const VendedorProcesarOrden = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  
  console.log("🔑 VITE_MAPBOX_TOKEN set:", !!MAPBOX_TOKEN, MAPBOX_TOKEN ? MAPBOX_TOKEN.slice(0, 10) + "..." : "(empty)");
  console.log("🔑 mapboxgl.accessToken set:", !!mapboxgl.accessToken);

  const [form, setForm] = useState({
    direccion: "",
    detalle: "",
    latitud: "40.4168",
    longitud: "-3.7038",
  });

  const [suggestions, setSuggestions] = useState([]);


  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const lat = useMemo(() => {
    const n = parseFloat(form.latitud);
    return Number.isFinite(n) ? n : 40.4168;
  }, [form.latitud]);

  const lon = useMemo(() => {
    const n = parseFloat(form.longitud);
    return Number.isFinite(n) ? n : -3.7038;
  }, [form.longitud]);

  // Init del mapa (solo 1 vez)
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    // Evita doble init en HMR
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lon, lat],
      zoom: 12,
    });

    // Marcador inicial
    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lon, lat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const { lng, lat } = markerRef.current.getLngLat();
      setForm((f) => ({ ...f, latitud: String(lat), longitud: String(lng) }));
    });

    // Click en el mapa → actualizar marker + inputs
    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      if (markerRef.current) markerRef.current.setLngLat([lng, lat]);
      setForm((f) => ({ ...f, latitud: String(lat), longitud: String(lng) }));
    });

    return () => {
      // cleanup si se desmonta
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MAPBOX_TOKEN]);

  // Cuando cambian lat/lon (por autocompletado o inputs) → mover mapa y marker
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLngLat([lon, lat]);
    mapRef.current.flyTo({ center: [lon, lat], zoom: 14, essential: true });
  }, [lat, lon]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

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
    setForm((f) => ({
      ...f,
      direccion: place.place_name,
      latitud: String(lat),
      longitud: String(lng),
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("tokenVendedor");
    if (!token) {
      alert("❌ No hay token de vendedor. Inicia sesión nuevamente.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/vendedor/orden/${itemId}/direccion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || "Error al guardar dirección");
      }

      alert("✅ Dirección guardada y orden marcada como en proceso");
      navigate("/vendedor/orders");
    } catch (err) {
      console.error("❌ Error al guardar dirección:", err);
      alert("❌ " + err.message);
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="container mt-4">
        <h2>Procesar Venta - Ítem #{itemId}</h2>
        <div className="alert alert-danger">
          Falta <code>VITE_MAPBOX_TOKEN</code>. Revisa tu <code>.env</code> y reinicia <code>npm run dev</code>.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Procesar Venta - Ítem #{itemId}</h2>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3 position-relative">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
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
            value={form.detalle}
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
              value={form.latitud}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Longitud</label>
            <input
              type="text"
              name="longitud"
              value={form.longitud}
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
          <button type="submit" className="btn btn-primary">Confirmar Dirección y Procesar</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/vendedor/orders")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};