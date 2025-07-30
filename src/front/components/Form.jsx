import React, { useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Form = ({ onAdd }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [rareza, setRareza] = useState("");
  const [stock, setStock] = useState("");
  const [vendedor_id, setVendedor_id] = useState("");

  const toggleForm = (type) => {
    setActiveForm((prev) => (prev === type ? null : type));
    setNombre("");
    setPrecio("");
    setRareza("");
    setStock("");
    setVendedor_id("");
  };

  const sendData = async (e) => {
    e.preventDefault();

    const body = {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      vendedor_id,
    };

    if (activeForm === "single") {
      body.rareza = rareza;
    }

    let endpoint = "";
    if (activeForm === "deck") endpoint = "/api/deck";
    if (activeForm === "single") endpoint = "/api/single";
    if (activeForm === "boosterPack") endpoint = "/api/boosterpacks";

    const url = `${backendUrl}${endpoint}`;
    console.log("Enviando a:", url, "Body:", body);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert("Error al crear producto");
        return;
      }

      const data = await response.json();
      let productData = data.carta || data; 

      
      if (activeForm === "deck") productData.type = "deck";
      if (activeForm === "single") productData.type = "single";
      if (activeForm === "boosterPack") productData.type = "boosterPack";

      if (onAdd) onAdd(productData); 

      setActiveForm(null);
      setNombre("");
      setPrecio("");
      setRareza("");
      setStock("");
      setVendedor_id("");
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("No se pudo conectar con el backend.");
    }
  };

  return (
    <div className="mt-4">
      <button type="button" onClick={() => toggleForm("deck")}>
        Agregar Deck
      </button>
      <button type="button" onClick={() => toggleForm("single")}>
        Agregar Single
      </button>
      <button type="button" onClick={() => toggleForm("boosterPack")}>
        Agregar Booster Pack
      </button>

     
      {(activeForm === "deck" || activeForm === "boosterPack") && (
        <form className="w-50 mx-auto mt-3" onSubmit={sendData}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" className="form-control" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" className="form-control"  required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" className="form-control" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Vendedor_id</label>
            <input value={vendedor_id} onChange={(e) => setVendedor_id(e.target.value)} type="text" className="form-control" required/>
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </form>
      )}


      {activeForm === "single" && (
        <form className="w-50 mx-auto mt-3" onSubmit={sendData}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} type="text" className="form-control" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" className="form-control"required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Rareza</label>
            <select value={rareza} onChange={(e) => setRareza(e.target.value)} className="form-control" required >
              <option value="" disabled> Selecciona rareza single</option>
              <option value="comun">Común</option>
              <option value="poco comun">Poco Común</option>
              <option value="rara">Rara</option>
              <option value="rara mitica">Rara Mítica</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" className="form-control" required/>
          </div>
          <div className="mb-3">
            <label className="form-label">Vendedor_id</label>
            <input value={vendedor_id} onChange={(e) => setVendedor_id(e.target.value)}type="text"className="form-control"required/>
          </div>
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
        </form>
      )}
    </div>
  );
};

export default Form;
