import React, { useEffect, useState, useRef } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Tienda } from "./Tienda";
import { Link } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const [commonCards, setCommonCards] = useState([]);
  const [uncommonCards, setUncommonCards] = useState([]);
  const [rareCards, setRareCards] = useState([]);
  const [mythicCards, setMythicCards] = useState([]);

  const commonRef = useRef(null);
  const uncommonRef = useRef(null);
  const rareRef = useRef(null);
  const mythicRef = useRef(null);

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error("❌ Error al obtener mensaje:", error);
    }
  };

  const loadCardsByRarity = async (rarity, setter) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/productos`);
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : []).filter(
        (p) => p.rarity?.toLowerCase() === rarity
      ).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        detalle: p.descripcion || "Sin descripción",
        precio: p.precio || 0,
        imagen: p.imageUrl || "https://placehold.co/400x300?text=Sin+imagen",
      }));
      setter(filtered);
    } catch (err) {
      console.error(`❌ Error al cargar cartas ${rarity}:`, err);
      setter([]);
    }
  };

  useEffect(() => {
    loadMessage();
    loadCardsByRarity("common", setCommonCards);
    loadCardsByRarity("uncommon", setUncommonCards);
    loadCardsByRarity("rare", setRareCards);
    loadCardsByRarity("mythic", setMythicCards);
  }, []);

  const scrollCarousel = (ref, direction = 1) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction * ref.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const renderCarousel = (cards, title, ref) => {
    if (!cards || cards.length === 0) return null;

    return (
      <div className="container my-5">
        <h2 className="text-center mb-4 gothic-font">{title}</h2>
        <div className="position-relative">
          <button
            onClick={() => scrollCarousel(ref, -1)}
            className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
            style={{ zIndex: 2 }}
          >
            {"<"}
          </button>
          <div
            ref={ref}
            className="d-flex overflow-auto pb-3 gap-3"
            style={{ scrollBehavior: "smooth", padding: "0 50px", height: "480px" }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="card border-0 card-hover"
                style={{ flex: "0 0 16.6667%", height: "400px" }}
              >
                <img
                  src={card.imagen}
                  className="card-img-top mt-3"
                  alt={card.nombre}
                  style={{ objectFit: "contain", height: "220px", width: "100%" }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300?text=Sin+imagen"; }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title gothic-font" style={{ fontSize: "1rem", height: "40px" }}>
                    {card.nombre}
                  </h5>
                  <p
                    className="card-text small"
                    style={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: "3",
                      WebkitBoxOrient: "vertical",
                      height: "60px",
                    }}
                  >
                    {card.detalle}
                  </p>
                  <p className="fw-bold gothic-font mb-2">${card.precio}</p>
                  <Link
                    to={`/tienda/detalles/${card.id}`}
                    className="btn btn-primary mt-auto gothic-font"
                  >
                    Ver más
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollCarousel(ref, 1)}
            className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
            style={{ zIndex: 2 }}
          >
            {">"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Carousel principal */}
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"  
        style={{ width: "1905px", height: "800px", margin: "0 auto" }}
      >
        <div className="carousel-inner h-100">
          <div className="carousel-item h-100">
            <img
              src="https://i.imgur.com/aput3Nu.jpeg"
              className="d-block w-100 h-100"
              alt="Imagen 2"
              style={{ objectFit: "fill" }}
            />
          </div>
          <div className="carousel-item active h-100">
            <img
              src="https://i.imgur.com/g0G6oFr.jpeg"
              className="d-block w-100 h-100"
              alt="Imagen 1"
              style={{ objectFit: "fill" }}
            />
          </div>
          <div className="carousel-item h-100">
            <img
              src="https://i.imgur.com/iXYjxBI.jpeg"
              className="d-block w-100 h-100"
              alt="Imagen 3"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Tienda original */}


      {/* Carouseles por rareza */}
      {renderCarousel(commonCards, "Cartas Comunes", commonRef)}
      {renderCarousel(uncommonCards, "Cartas Poco Comunes", uncommonRef)}
      {renderCarousel(rareCards, "Cartas Raras", rareRef)}
      {renderCarousel(mythicCards, "Cartas Míticas", mythicRef)}
    </>
  );
};
