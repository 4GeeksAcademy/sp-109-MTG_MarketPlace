import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Map, { Marker } from "react-map-gl";

export const VendedorProcesarOrden = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
  console.log("✅ MAPBOX TOKEN:", mapboxToken);

  if (!mapboxToken || mapboxToken === "no-token") {
    console.error("❌ Mapbox token no definido o incorrecto");
  }

  const [form, setForm] = useState({
    direccion: "",
    detalle: "",
    latitud: "",
    longitud: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 40.4168,
    longitude: -3.7038,
    zoom: 12,
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "direccion" && value.length >= 3 && mapboxToken) {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("❌ Error buscando lugares:", error);
      }
    }
  };

  const handleSuggestionClick = (place) => {
    setForm({
      ...form,
      direccion: place.place_name,
      latitud: place.geometry.coordinates[1],
      longitud: place.geometry.coordinates[0],
    });

    setSuggestions([]);
    setViewport({
      ...viewport,
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("🧪 El guardado de dirección está deshabilitado por ahora.");
    // Aquí puedes volver a integrar el guardado cuando todo funcione correctamente
  };

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
            <ul
              className="list-group position-absolute w-100"
              style={{ zIndex: 10 }}
            >
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
          ></textarea>
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

        <Map
          mapboxAccessToken={mapboxToken}
          initialViewState={{
            latitude: parseFloat(form.latitud) || viewport.latitude,
            longitude: parseFloat(form.longitud) || viewport.longitude,
            zoom: viewport.zoom,
          }}
          style={{ width: "100%", height: 300, marginBottom: "1rem" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <Marker
            latitude={parseFloat(form.latitud) || viewport.latitude}
            longitude={parseFloat(form.longitud) || viewport.longitude}
          />
        </Map>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Confirmar Dirección y Procesar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/vendedor/orders")}
          >
            Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};