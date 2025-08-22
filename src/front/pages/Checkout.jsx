import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carrito = location.state?.carrito; // viene desde CompradorProcesarOrdenes o Carrito

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [addresses, setAddresses] = useState({}); // { [item_id]: {direccion, detalle, latitud, longitud, status} }
  const [loadingAddrs, setLoadingAddrs] = useState(true);
  const [addrError, setAddrError] = useState("");

  // Si no hay carrito en state
  if (!carrito) return <p className="text-center">No se encontró el carrito.</p>;

  const total = useMemo(
    () =>
      carrito.items.reduce(
        (acc, item) => acc + (item.producto?.precio || 0) * item.cantidad,
        0
      ),
    [carrito.items]
  );

  // Traer direcciones guardadas para cada item
  useEffect(() => {
    const run = async () => {
      setLoadingAddrs(true);
      setAddrError("");

      const token = localStorage.getItem("tokenComprador");
      if (!token) {
        setAddrError("Debes iniciar sesión como comprador para continuar.");
        setLoadingAddrs(false);
        return;
      }

      try {
        const results = await Promise.all(
          carrito.items.map(async (it) => {
            try {
              const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/comprador/orden/${it.item_id}/direccion`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (res.ok) {
                const d = await res.json();
                return [it.item_id, d];
              }
            } catch (e) {}
            return [it.item_id, null];
          })
        );

        const map = {};
        for (const [id, d] of results) map[id] = d;
        setAddresses(map);
      } catch (e) {
        console.error("❌ Error obteniendo direcciones:", e);
        setAddrError("Error obteniendo direcciones de envío.");
      } finally {
        setLoadingAddrs(false);
      }
    };
    run();
  }, [carrito.items]);

  const allHaveAddress = useMemo(
    () =>
      carrito.items.every(
        (it) => addresses[it.item_id] && addresses[it.item_id].direccion
      ),
    [carrito.items, addresses]
  );

  const handleConfirm = () => {
    // Validaciones
    if (!paymentMethod) {
      alert("Selecciona un método de pago.");
      return;
    }
    if (!allHaveAddress) {
      alert("Falta la dirección de envío en uno o más ítems.");
      return;
    }

    // Simular pago
    alert(`✅ Pago registrado esperando respuesta admin. Total: ${total.toFixed(2)} €`);

    // Vaciar carrito local
    const carritoCopy = { ...carrito, items: [] };

    // Ir a Receipt
    navigate("/receipt", { state: { carrito: carritoCopy, paymentMethod } });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="border rounded-lg p-4 mb-6 shadow">
        {carrito.items.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul>
            {carrito.items.map((item) => {
              const lineTotal = ((item.producto?.precio || 0) * item.cantidad).toFixed(2);
              const addr = addresses[item.item_id];
              return (
                <li key={item.item_id || item.producto?.id} className="py-3 border-b">
                  <div className="flex justify-between">
                    <span>
                      {item.producto?.nombre || "Desconocido"} x {item.cantidad}
                    </span>
                    <span>{lineTotal} €</span>
                  </div>

                  {/* Dirección por ítem */}
                  <div className="mt-2 text-sm">
                    {loadingAddrs ? (
                      <span className="text-gray-500">Cargando dirección…</span>
                    ) : addrError ? (
                      <span className="text-red-600">{addrError}</span>
                    ) : addr?.direccion ? (
                      <>
                        <div className="text-gray-800">
                          <strong>Envío:</strong> {addr.direccion}
                        </div>
                        {addr.detalle && (
                          <div className="text-gray-600">Detalle: {addr.detalle}</div>
                        )}
                      </>
                    ) : (
                      <span className="text-red-600">
                        ⚠️ Sin dirección — vuelve a “Procesar direcciones”.
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="text-right mt-3 font-semibold">
          Total: {total.toFixed(2)} €
        </div>
      </div>

      {/* Botones de método de pago */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setPaymentMethod("Bizum")}
          className={`flex-1 p-3 rounded-lg border ${
            paymentMethod === "Bizum" ? "bg-blue-100 border-blue-400" : "bg-white"
          }`}
        >
          Bizum
        </button>
        <button
          onClick={() => setPaymentMethod("Transferencia")}
          className={`flex-1 p-3 rounded-lg border ${
            paymentMethod === "Transferencia" ? "bg-blue-100 border-blue-400" : "bg-white"
          }`}
        >
          Transferencia
        </button>
        <button
          onClick={() => setPaymentMethod("Tarjeta")}
          className={`flex-1 p-3 rounded-lg border ${
            paymentMethod === "Tarjeta" ? "bg-blue-100 border-blue-400" : "bg-white"
          }`}
        >
          Tarjeta
        </button>
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
          <button
            onClick={handleConfirm}
            disabled={loadingAddrs || !allHaveAddress}
            className={`mt-4 w-full p-3 font-semibold rounded-lg shadow text-white ${
              loadingAddrs || !allHaveAddress ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loadingAddrs ? "Verificando direcciones…" : "Pagar y Continuar"}
          </button>
        </div>
      )}

      {/* Bizum */}
      {paymentMethod === "Bizum" && (
        <div className="mt-4 border rounded-lg p-4 bg-green-50 space-y-2">
          <h3 className="font-semibold mb-2">Pago con Bizum</h3>
          <p>
            Envía el pago con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.
          </p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">Número Bizum: 600123456</p>
          <button
            onClick={handleConfirm}
            disabled={loadingAddrs || !allHaveAddress}
            className={`mt-2 w-full p-3 font-semibold rounded-lg shadow text-white ${
              loadingAddrs || !allHaveAddress ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Realizar Pago
          </button>
        </div>
      )}

      {/* Transferencia */}
      {paymentMethod === "Transferencia" && (
        <div className="mt-4 border rounded-lg p-4 bg-yellow-50 space-y-2">
          <h3 className="font-semibold mb-2">Transferencia Bancaria</h3>
          <p>
            Realiza la transferencia con el concepto: <strong>Nombre Usuario + Cartas Compradas</strong>.
          </p>
          <p className="mt-2 font-mono bg-gray-100 p-2 rounded">IBAN: ES00 1234 5678 9012 3456 7890</p>
          <button
            onClick={handleConfirm}
            disabled={loadingAddrs || !allHaveAddress}
            className={`mt-2 w-full p-3 font-semibold rounded-lg shadow text-white ${
              loadingAddrs || !allHaveAddress ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Realizar Transferencia
          </button>
        </div>
      )}

      {/* Nota si falta dirección */}
      {!loadingAddrs && !allHaveAddress && (
        <p className="text-sm text-red-600 mt-4">
          Falta la dirección de uno o más ítems. Vuelve a “Procesar direcciones” para completarlas.
        </p>
      )}
    </div>
  );
};