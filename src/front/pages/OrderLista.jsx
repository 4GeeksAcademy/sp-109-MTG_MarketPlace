const OrderLista = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`${API}/orders`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(setOrders);
  }, []);
  return (
    <table>{orders.map(o =>
      <tr key={o.id}>
        <td>{o.id}</td>
        <td>{new Date(o.created_at).toLocaleString()}</td>
        <td>{o.status}</td>
        <td><Link to={`/orders/${o.id}`}>Ver</Link></td>
      </tr>)}
    </table>);
};
