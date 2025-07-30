import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Form from "./Form.jsx";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const DataComponent = () => {
  const { store, dispatch } = useGlobalReducer();

  const [allProductsCombined, setAllProductsCombined] = useState({
    decks: [],
    singles: [],
    boosterPacks: [],
  });

  const [filterType, setFilterType] = useState("all");

  const loadMessage = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/hello`);
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error("Error al cargar mensaje:", error);
    }
  };

  const loadAllCategoriesCombined = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/categorias`);
      const data = await response.json();

      if (response.ok) {
        setAllProductsCombined(data);
      } else {
        console.error("Error al obtener categorías:", data);
        setAllProductsCombined({ decks: [], singles: [], boosterPacks: [] });
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setAllProductsCombined({ decks: [], singles: [], boosterPacks: [] });
    }
  };

  const deleteProduct = async (productToDelete) => {
    try {
      let endpoint = "";
      if (productToDelete.type === "deck") endpoint = "deck";
      if (productToDelete.type === "single") endpoint = "single";
      if (productToDelete.type === "boosterPack") endpoint = "boosterpacks";

      const response = await fetch(
        `${backendUrl}/api/${endpoint}/${productToDelete.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setAllProductsCombined((prev) => ({
          decks: prev.decks.filter((p) => !(p.id === productToDelete.id && productToDelete.type === "deck")),
          singles: prev.singles.filter((p) => !(p.id === productToDelete.id && productToDelete.type === "single")),
          boosterPacks: prev.boosterPacks.filter((p) => !(p.id === productToDelete.id && productToDelete.type === "boosterPack")),
        }));
      } else {
        const data = await response.json();
        alert("Error al eliminar: " + data.msg);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el backend");
    }
  };

  const handleAddProduct = (newProduct) => {
    console.log("Nuevo producto recibido en Base:", newProduct);
    setAllProductsCombined((prev) => {
      if (newProduct.type === "deck") return { ...prev, decks: [...prev.decks, newProduct] };
      if (newProduct.type === "single") return { ...prev, singles: [...prev.singles, newProduct] };
      if (newProduct.type === "boosterPack") return { ...prev, boosterPacks: [...prev.boosterPacks, newProduct] };
      return prev;
    });
  };

  const getFilteredProducts = () => {
    const allProducts = [
      ...(Array.isArray(allProductsCombined.decks)
        ? allProductsCombined.decks.map((item) => ({ ...item, type: "deck" }))
        : []),
      ...(Array.isArray(allProductsCombined.singles)
        ? allProductsCombined.singles.map((item) => ({ ...item, type: "single" }))
        : []),
      ...(Array.isArray(allProductsCombined.boosterPacks)
        ? allProductsCombined.boosterPacks.map((item) => ({ ...item, type: "boosterPack" }))
        : []),
    ];

    if (filterType === "all") return allProducts;
    return allProducts.filter((product) => product.type === filterType);
  };

  const productsToDisplay = getFilteredProducts();

  useEffect(() => {
    loadMessage();
    loadAllCategoriesCombined();
  }, []);

  return (
    <div className="text-center mt-5">
      <Form onAdd={handleAddProduct} />
      <div>
        <button onClick={() => setFilterType("all")}>Todas</button>
        <button onClick={() => setFilterType("deck")}>Deck</button>
        <button onClick={() => setFilterType("single")}>Single</button>
        <button onClick={() => setFilterType("boosterPack")}>Booster Pack</button>
      </div>

    
      <div className="container">
        <ul className="list-group mb-4">
          {productsToDisplay.length > 0 ? (
            productsToDisplay.map((product) => (
              <li
                key={product.id + "-" + product.type}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  {product.nombre} - Precio: ${product.precio} - Stock: {product.stock}
                  {product.type === "single" && product.rareza && ` - Rareza: ${product.rareza}`}
                </div>
                <button type="button" onClick={() => deleteProduct(product)}>
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <li className="list-group-item">
              No hay {filterType === "all" ? "" : filterType + "s"} disponibles 
            </li>
          )}
        </ul>
      </div>

     
      <div className="alert alert-info">
        {store.message ? (
          <span>{store.message}</span>
        ) : (
          <span className="text-danger">
            Loading message from the backend (make sure your python 🐍 backend is running)...
          </span>
        )}
      </div>

      
    </div>
  );
};

export default DataComponent;
