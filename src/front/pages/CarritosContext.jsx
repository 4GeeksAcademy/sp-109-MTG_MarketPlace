// src/front/pages/CarritosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CarritosContext = createContext();

export const CarritosProvider = ({ children }) => {
  const [carritos, setCarritos] = useState(() => {
    const saved = localStorage.getItem("carritos");
    return saved ? JSON.parse(saved) : [];
  });

  const addCarrito = (carrito) => {
    setCarritos(prev => [...prev, carrito]);
  };

  const updateCarrito = (id, data) => {
    setCarritos(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
  };

  const removeCarrito = (id) => {
    setCarritos(prev => prev.filter(c => c.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("carritos", JSON.stringify(carritos));
  }, [carritos]);

  return (
    <CarritosContext.Provider value={{ carritos, addCarrito, updateCarrito, removeCarrito }}>
      {children}
    </CarritosContext.Provider>
  );
};

export const useCarritos = () => {
  const context = useContext(CarritosContext);
  if (!context) throw new Error("useCarritos debe usarse dentro de CarritosProvider");
  return context;
};
