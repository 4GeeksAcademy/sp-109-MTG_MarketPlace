import React, { useState } from "react";
import { useCart } from "./CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard, faCcAmex } from "@fortawesome/free-brands-svg-icons";

export default function Checkout({ onComplete }) {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardType, setCardType] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleConfirm = () => {
    alert(`✅ Pago realizado con ${paymentMethod}. Total: ${total.toFixed(2)} €`);
    clearCart();
    if (onComplete) onComplete({ paymentMethod, total, items: cart });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Carrito */}
      <div className="border rounded-lg p-4 mb-6 shadow">
        {cart.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <span>{item.name} x {item.qty}</span>
                <span>{(item.price * item.qty).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}
        <div className="text-right mt-3 font-semibold">
          Total: {total.toFixed(2)} €
        </div>
      </div>

      {/* Botones para seleccionar método */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPaymentMethod("Bizum")}
          className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Bizum" ? "bg-blue-100 border-blue-400" : "bg-white"}`}
        >
          Bizum
        </button>
        <button
          onClick={() => setPaymentMethod("Transferencia")}
          className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Transferencia" ? "bg-blue-100 border-blue-400" : "bg-white"}`}
        >
          Transferencia
        </button>
        <button
          onClick={() => setPaymentMethod("Tarjeta")}
          className={`flex-1 p-3 rounded-lg border ${paymentMethod === "Tarjeta" ? "bg-blue-100 border-blue-400" : "bg-white"}`}
        >
          Tarjeta
        </button>
      </div>

      {/* Formulario Tarjeta */}
      {paymentMethod === "Tarjeta" && (
        <div className="mt-4 space-y-3 border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Pago con Tarjeta</h3>
          <div className="flex gap-4 mb-4">
            <button onClick={() => setCardType("Visa")}>
              <FontAwesomeIcon icon={faCcVisa} className={`text-4xl ${cardType === "Visa" ? "text-blue-600" : "text-gray-400"}`} />
            </button>
            <button onClick={() => setCardType("Mastercard")}>
              <FontAwesomeIcon icon={faCcMastercard} className={`text-4xl ${cardType === "Mastercard" ? "text-red-600" : "text-gray-400"}`} />
            </button>
            <button onClick={() => setCardType("Amex")}>
              <FontAwesomeIcon icon={faCcAmex} className={`text-4xl ${cardType === "Amex" ? "text-green-600" : "text-gray-400"}`} />
            </button>
          </div>

          {cardType && (
            <div className="space-y-2">
              <input type="text" placeholder="Número de tarjeta" className="w-full border p-2 rounded" />
              <div className="flex gap-2">
                <input type="text" placeholder="MM/YY" className="w-1/2 border p-2 rounded" />
                <input type="text" placeholder="CVC" className="w-1/2 border p-2 rounded" />
              </div>

              <button
                onClick={handleConfirm}
                className="mt-4 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
              >
                Pagar y Continuar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transferencia */}
      {paymentMethod === "Transferencia" && (
        <div className="mt-4 border rounded-lg p-4 bg-yellow-50 space-y-2">
          <h3 className="font-semibold mb-2">Transferencia Bancaria</h3>
          <p>
            Realiza la transferencia con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.<br/>
            Una vez recibido, los administradores aprobarán la orden.
          </p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">IBAN: ES00 1234 5678 9012 3456 7890</p>
          <button
            onClick={handleConfirm}
            className="mt-2 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
          >
            Realizar Transferencia
          </button>
        </div>
      )}

      {/* Bizum */}
      {paymentMethod === "Bizum" && (
        <div className="mt-4 border rounded-lg p-4 bg-green-50 space-y-2">
          <h3 className="font-semibold mb-2">Pago con Bizum</h3>
          <p>
            Envía el pago con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.<br/>
            Una vez recibido, los administradores aprobarán la orden.
          </p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">Número Bizum: 600123456</p>
          <button
            onClick={handleConfirm}
            className="mt-2 w-full p-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
          >
            Realizar Transferencia
          </button>
        </div>
      )}
    </div>
  );
}