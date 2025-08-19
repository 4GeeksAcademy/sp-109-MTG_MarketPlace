export default function Receipt({ order, onBack }) {
  const mensajePago = "Esperando confirmación del admin";

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Resumen del pedido</h2>

      <div className="mb-4">
        {order?.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold mb-4">
        <span>Total:</span>
        <span>${order?.total.toFixed(2)}</span>
      </div>

      <div className="mb-4 p-2 rounded bg-yellow-100 text-yellow-800 font-semibold">
        {mensajePago}
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onBack}
      >
        Volver
      </button>
    </div>
  );
}
