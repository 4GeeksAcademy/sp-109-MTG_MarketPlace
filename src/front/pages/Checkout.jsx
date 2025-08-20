import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carrito = location.state?.carrito; // recibimos el carrito desde CompradorCarrito

  const [paymentMethod, setPaymentMethod] = useState(null);

  if (!carrito) return <p className="text-center">No se encontró el carrito.</p>;

  const total = carrito.items.reduce(
    (acc, item) => acc + (item.producto?.precio || 0) * item.cantidad,
    0
  );

  const handleConfirm = () => {
    // Aquí simulas que el pago fue exitoso
    alert(`✅ Pago registrado esperando respuesta admin. Total: ${total.toFixed(2)} €`);

    // Vaciar carrito local
    carrito.items = [];
    
    // Redirigir a Receipt
    navigate("/receipt", { state: { carrito } });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="border rounded-lg p-4 mb-6 shadow">
        {carrito.items.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul>
            {carrito.items.map((item) => (
              <li key={item.item_id || item.producto?.id} className="flex justify-between border-b py-2">
                <span>{item.producto?.nombre || "Desconocido"} x {item.cantidad}</span>
                <span>{((item.producto?.precio || 0) * item.cantidad).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}
        <div className="text-right mt-3 font-semibold">
          Total: {total.toFixed(2)} €
        </div>
      </div>

      {/* Botones de método de pago */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => setPaymentMethod("Bizum")} className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Bizum" ? "bg-blue-100 border-blue-400" : "bg-white"}`}>Bizum</button>
        <button onClick={() => setPaymentMethod("Transferencia")} className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Transferencia" ? "bg-blue-100 border-blue-400" : "bg-white"}`}>Transferencia</button>
        <button onClick={() => setPaymentMethod("Tarjeta")} className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Tarjeta" ? "bg-blue-100 border-blue-400" : "bg-white"}`}>Tarjeta</button>
      </div>

      {/* Formulario tarjeta */}
      {paymentMethod === "Tarjeta" && (
        <div className="mt-4 space-y-3 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Pago con Tarjeta</h3>
          <input type="text" placeholder="Número de tarjeta" className="w-full border p-2 rounded" />
          <div className="flex gap-2">
            <input type="text" placeholder="MM/YY" className="w-1/2 border p-2 rounded" />
            <input type="text" placeholder="CVC" className="w-1/2 border p-2 rounded" />
          </div>
          <button onClick={handleConfirm} className="mt-4 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
            Pagar y Continuar
          </button>
        </div>
      )}

      {/* Bizum */}
      {paymentMethod === "Bizum" && (
        <div className="mt-4 border rounded-lg p-4 bg-green-50 space-y-2">
          <h3 className="font-semibold mb-2">Pago con Bizum</h3>
          <p>Envía el pago con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.</p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">Número Bizum: 600123456</p>
          <button onClick={handleConfirm} className="mt-2 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
            Realizar Pago
          </button>
        </div>
      )}

      {/* Transferencia */}
      {paymentMethod === "Transferencia" && (
        <div className="mt-4 border rounded-lg p-4 bg-yellow-50 space-y-2">
          <h3 className="font-semibold mb-2">Transferencia Bancaria</h3>
          <p>Realiza la transferencia con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.</p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">IBAN: ES00 1234 5678 9012 3456 7890</p>
          <button onClick={handleConfirm} className="mt-2 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700">
            Realizar Transferencia
          </button>
        </div>
      )}
    </div>
  );
};
