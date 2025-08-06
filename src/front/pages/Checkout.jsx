import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate, useParams } from "react-router-dom";

export const Checkout = () => {
  const { id: carritoId } = useParams();
  const [metodo, setMetodo] = useState("offline"); // 'offline', 'tarjeta', 'paypal'
  const [form, setForm] = useState({ nombre: "", direccion: "", ciudad: "" });
  const navigate = useNavigate();

  // Valor provisional, reemplaza con la lógica real para calcular el total
  const amount = 0; // TODO: calcula total desde items del carrito o el state

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const pagoOffline = () => {
    // lógica offline existente
    alert("Pedido offline confirmado");
    navigate(`/carritos/detalles/${carritoId}`);
  };

  return (
    <div className="container mt-4">
      <h2>Finalizar Compra</h2>
      <div className="mb-3">
        <label>Selección de método de pago:</label><br/>
        <select value={metodo} onChange={e => setMetodo(e.target.value)} className="form-select w-auto">
          <option value="offline">Bizum / Transferencia / Tarjeta</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {(metodo === "offline") && (
        <>
          {/* tu formulario y lógica offline */}
          <button onClick={pagoOffline} className="btn btn-primary">Confirmar pedido (offline)</button>
        </>
      )}

      {(metodo === "paypal") && (
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "EUR" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(_data, actions) => {
              return fetch(import.meta.env.VITE_BACKEND_URL + "/api/orders_paypal/create", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ carritoId, amount })
              })
              .then(res => res.json())
              .then(json => json.orderID);
            }}
            onApprove={(_data, actions) => {
              return fetch(import.meta.env.VITE_BACKEND_URL + "/api/orders_paypal/capture", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ carritoId, orderID: _data.orderID })
              })
              .then(res => res.json())
              .then(json => {
                if (json.status === "COMPLETED") {
                  alert("Pago completado. Pedido nº: " + json.captureID);
                  navigate(`/carritos/detalles/${carritoId}`);
                } else throw new Error("No completado");
              });
            }}
            onError={err => alert("Error al procesar PayPal: " + err.message)}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};
