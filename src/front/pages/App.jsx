// src/front/App.jsx
import React, { useState } from "react";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import { CartProvider } from "./pages/CartContext";

export default function App() {
  const [order, setOrder] = useState(null);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {!order ? (
          <Checkout onComplete={(orderData) => setOrder(orderData)} />
        ) : (
          <Receipt order={order} onBack={() => setOrder(null)} />
        )}
      </div>
    </CartProvider>
  );
}
