const OrderDetalle = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    fetch(`${API}/orders/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(setOrder);
  }, [id]);
  if (!order) return <p>Cargando...</p>;
  return (
    <div>
      <h2>Orden #{order.id}</h2>
      <p>{new Date(order.created_at).toLocaleString()}</p>
      <p>Total: {order.total}€</p>
      <ul>{order.items.map((it,i)=>(
         <li key={i}>{it.producto.nombre} × {it.cantidad} = {it.precio_unitario * it.cantidad}€</li>
      ))}</ul>
    </div>
  );
};
