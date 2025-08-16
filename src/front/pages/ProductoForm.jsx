import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_BACKEND_URL + "/api/productos";

export const ProductoForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imageUrl: "",
    type: "",
    rarity: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const token = localStorage.getItem("tokenVendedor");

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.magicthegathering.io/v1/cards?name=${query}`
      );
      const data = await res.json();
      if (res.ok && data.cards) {
        // Obtenemos los nombres de las cartas para las sugerencias
        const uniqueNames = [
          ...new Set(data.cards.map((card) => card.name)),
        ].sort();
        setSuggestions(uniqueNames);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("❌ Error fetching MTG cards:", err);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (cardName) => {
    try {
      // Hacemos una nueva llamada a la API para obtener todos los detalles de la carta
      const res = await fetch(
        `https://api.magicthegathering.io/v1/cards?name=${cardName}`
      );
      const data = await res.json();

      if (res.ok && data.cards && data.cards.length > 0) {
        const card = data.cards[0]; // Tomamos la primera carta del resultado

        // Actualizamos el estado del formulario con los datos de la carta
        setForm({
          ...form,
          nombre: card.name || "",
          descripcion: card.text || "",
          imageUrl: card.imageUrl || "",
          type: card.type || "",
          rarity: card.rarity || "",
        });
      }
      setSuggestions([]); // Ocultamos la lista de sugerencias
    } catch (err) {
      console.error("❌ Error fetching card details:", err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const timeoutId = setTimeout(() => {
      fetchSuggestions(form.nombre);
    }, 500);
    setDebounceTimeout(timeoutId);
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [form.nombre]);

  useEffect(() => {
    if (editing) {
      fetch(`${API}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            imageUrl: data.imageUrl,
            type: data.type,
            rarity: data.rarity,
          });
        })
        .catch((err) => console.error("❌ Error al cargar producto:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.precio || isNaN(form.precio))
      newErrors.precio = "Precio válido requerido.";
    if (!form.imageUrl.trim())
      newErrors.imageUrl = "El URL de la imagen es obligatorio.";
    if (!form.type.trim()) newErrors.type = "El tipo es obligatorio.";
    if (!form.rarity.trim()) newErrors.rarity = "La rareza es obligatoria.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length) {
      setErrors(valErrors);
      return;
    }
    try {
      const res = await fetch(editing ? `${API}/${id}` : API, {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: form.nombre,
          descripcion: form.descripcion,
          precio: parseFloat(form.precio),
          imageUrl: form.imageUrl,
          type: form.type,
          rarity: form.rarity,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      navigate("/productos");
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>{editing ? "Editar Producto" : "Crear Producto"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="nombre"
            className="form-control"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <div className="text-danger">{errors.nombre}</div>}
          {suggestions.length > 0 && (
            <ul className="list-group mt-2">
              {suggestions.map((s, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(s)} // <- Llamamos a la nueva función
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-3">
          <textarea
            name="descripcion"
            className="form-control"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            name="precio"
            className="form-control"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
          />
          {errors.precio && <div className="text-danger">{errors.precio}</div>}
        </div>

        <div className="mb-3">
          <input
            name="imageUrl"
            className="form-control"
            placeholder="URL de la Imagen"
            value={form.imageUrl}
            onChange={handleChange}
          />
          {errors.imageUrl && (
            <div className="text-danger">{errors.imageUrl}</div>
          )}
        </div>

        <div className="mb-3">
          <input
            name="type"
            className="form-control"
            placeholder="Tipo (p.ej. 'accesorio')"
            value={form.type}
            onChange={handleChange}
          />
          {errors.type && <div className="text-danger">{errors.type}</div>}
        </div>

        <div className="mb-3">
          <input
            name="rarity"
            className="form-control"
            placeholder="Rareza (p.ej. 'común', 'raro')"
            value={form.rarity}
            onChange={handleChange}
          />
          {errors.rarity && <div className="text-danger">{errors.rarity}</div>}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-success">
            {editing ? "Guardar cambios" : "Crear"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => navigate("/productos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};