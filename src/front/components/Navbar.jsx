import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const tokenVendedor = localStorage.getItem("tokenVendedor");
  const vendedorUsername = localStorage.getItem("vendedorUsername");

  const tokenComprador = localStorage.getItem("tokenComprador");
  const compradorUsername = localStorage.getItem("compradorUsername");

  const handleLogoutVendedor = () => {
    localStorage.removeItem("tokenVendedor");
    localStorage.removeItem("vendedorUsername");
    navigate("/vendedor/login");
  };

  const handleLogoutComprador = () => {
    localStorage.removeItem("tokenComprador");
    localStorage.removeItem("compradorUsername");
    navigate("/comprador/login");
  };

  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand mb-0 h1">
          MTG Marketplace
        </Link>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <Link to="/demo">
            <button className="btn btn-primary">Check Context</button>
          </Link>
          <Link to="/vendedores">
            <button className="btn btn-secondary">Vendedores</button>
          </Link>
          <Link to="/compradores">
            <button className="btn btn-secondary">Compradores</button>
          </Link>
          <Link to="/categorias">
            <button className="btn btn-secondary">Categorías</button>
          </Link>
          <Link to="/productos">
            <button className="btn btn-secondary">Productos</button>
          </Link>
          <Link to="/carritos">
            <button className="btn btn-secondary">Carritos</button>
          </Link>
          <Link to="/itemcarrito">
            <button className="btn btn-secondary">Ítems Carrito</button>
          </Link>
          <Link to="/checkout">
            <button className="btn btn-success">Checkout</button>
          </Link>


          {/* Botón para Admins */}
          <Link to="/admins">
            <button className="btn btn-warning">Admins</button>
          </Link>

          {/* Estado de sesión */}
          {tokenVendedor ? (
            <div className="d-flex align-items-center gap-2 ms-3">
              <span className="fw-bold text-dark">👋 {vendedorUsername} (Vendedor)</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogoutVendedor}>
                Cerrar sesión
              </button>
            </div>
          ) : tokenComprador ? (
            <div className="d-flex align-items-center gap-2 ms-3">
              <span className="fw-bold text-dark">👋 {compradorUsername} (Comprador)</span>
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogoutComprador}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2 ms-3">
              <Link to="/vendedor/login">
                <button className="btn btn-outline-success btn-sm">Login Vendedor</button>
              </Link>
              <Link to="/comprador/login">
                <button className="btn btn-outline-primary btn-sm">Login Comprador</button>
              </Link>
            </div>
          )}
          <Link to="/checkout">
          <button className="btn btn-success">Checkout</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
