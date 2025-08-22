// src/front/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { BackendURL } from "./components/BackendURL";
import { CartProvider } from "./pages/CartContext";
import { StoreProvider } from "./hooks/useGlobalReducer";
import { CarritosProvider } from "./pages/CarritosContext";
import "bootstrap-icons/font/bootstrap-icons.css";


const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const Main = () => {
  if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
    return (
      <React.StrictMode>
        <BackendURL />
      </React.StrictMode>
    );
  }

  return (
    <React.StrictMode>
      <StoreProvider>
        <CarritosProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </CarritosProvider>
      </StoreProvider>
    </React.StrictMode>
  );
};

root.render(<Main />);
