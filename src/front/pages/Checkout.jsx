import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { id: carritoId } = useParams();
  const [metodo, setMetodo] = useState("offline"); // 'offline', 'online', 'paypal'
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const pagoOffline = () => {
    alert(
      "Pedido offline confirmado. Realiza el pago a Bizum o transferencia y espera confirmación."
    );
    navigate(`/carritos/detalles/${carritoId}`);
  };

  const pagoOnline = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Llamada backend para crear sesión Stripe
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carritoId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error creando sesión Stripe");

      const stripe = await stripePromise;

      // Redirigir a Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) alert(error.message);

    } catch (err) {
      alert("Error al procesar pago: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const amount = 20; // Aquí el importe real o calculado (si es necesario para PayPal)

  return (
    <div className="container mt-4">
      <h2>Finalitzar Compra</h2>

      <div className="mb-3">
        <label>Mètode de pagament:</label>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value)}
          className="form-select w-auto"
        >
          <option value="offline">Bizum / Transferència Bancària</option>
          <option value="online">Targeta de Crèdito / Dèbito (Stripe)</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {metodo === "offline" && (
        <div className="border p-3 rounded">
          <h5>Pagament Offline</h5>
          <p>
            Fes el Bizum a aquest número de telèfon (en el concepte posa el
            número de comanda):
          </p>
          <strong>📱 612 345 678</strong>
          <p className="mt-3">
            O transferència al següent número de compte amb el concepte del
            número de comanda:
          </p>
          <strong>💳 ES76 2100 0813 6101 2345 6789</strong>
          <br />
          <button onClick={pagoOffline} className="btn btn-primary mt-3">
            Confirmar Pedido
          </button>
        </div>
      )}

      {metodo === "online" && (
        <div className="border p-3 rounded">
          <h5>Pagament amb Targeta</h5>
          <form onSubmit={pagoOnline}>
            <p>
              Seràs redirigit a Stripe per completar el pagament de forma segura.
            </p>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Processant..." : "Pagar amb Stripe"}
            </button>
          </form>
        </div>
      )}

      {metodo === "paypal" && (
        <div className="border p-3 rounded">
          <h5>Pagament amb PayPal</h5>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(_data, actions) => {
              return fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/orders_paypal/create",
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ carritoId, amount }),
                }
              )
                .then((res) => res.json())
                .then((json) => json.orderID);
            }}
            onApprove={(_data, actions) => {
              return fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/orders_paypal/capture",
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ carritoId, orderID: _data.orderID }),
                }
              )
                .then((res) => res.json())
                .then((json) => {
                  if (json.status === "COMPLETED") {
                    alert("Pago completado. Pedido nº: " + json.captureID);
                    navigate(`/carritos/detalles/${carritoId}`);
                  } else throw new Error("No completado");
                });
            }}
            onError={(err) =>
              alert("Error al processar PayPal: " + err.message)
            }
          />
        </div>
      )}
    </div>
  );
};

export default Checkout;
