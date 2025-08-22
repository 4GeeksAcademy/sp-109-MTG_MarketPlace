import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();

  const tokenVendedor = localStorage.getItem("tokenVendedor");
  const vendedorUsername = localStorage.getItem("vendedorUsername");

  const tokenUserAdmin = localStorage.getItem("tokenUserAdmin");
  const userAdminEmail = localStorage.getItem("userAdminEmail");

  const tokenComprador = localStorage.getItem("tokenComprador");
  const compradorUsername = localStorage.getItem("compradorUsername");

  const handleLogoutVendedor = () => {
    localStorage.removeItem("tokenVendedor");
    localStorage.removeItem("vendedorUsername");
    localStorage.removeItem("vendedorId");
    navigate("/vendedor/login");
  };

  const handleLogoutUserAdmin = () => {
    localStorage.removeItem("tokenUserAdmin");
    localStorage.removeItem("userAdminEmail");
    localStorage.removeItem("userAdminId");
    navigate("/useradmin/login");
  };

  const handleLogoutComprador = () => {
    localStorage.removeItem("tokenComprador");
    localStorage.removeItem("compradorUsername");
    localStorage.removeItem("compradorId");
    navigate("/comprador/login");
  };

  return (
    <nav className="navbar navbar-light shadow-sm" style={{ backgroundColor: '#ffffff' }}>
      <div className="container d-flex justify-content-between align-items-center">

        {/* Logo */}
        <NavLink to="/" className="navbar-brand mb-0 h1">
          <img src="https://i.imgur.com/Gij9B1M.png" alt="MTG Marketplace Logo" style={{ height: '100px' }} />
        </NavLink>

        {/* Botones centrales */}
        <div className="mx-auto d-flex gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/tienda"
            className={({ isActive }) =>
              `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
            }
          >
            Tienda
          </NavLink>

          {/* Productos para Vendedor y Admin */}
          {(tokenVendedor || tokenUserAdmin) && !tokenComprador && (
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
              }
            >
              Productos
            </NavLink>
          )}

          {/* Admin: Carritos y Órdenes */}
          {tokenUserAdmin && !tokenComprador && (
            <>
              <NavLink
                to="/useradmin/carrito"
                className={({ isActive }) =>
                  `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
                }
              >
                Carritos
              </NavLink>

              <NavLink
                to="/useradmin/ordenes"
                className={({ isActive }) =>
                  `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
                }
              >
                Órdenes
              </NavLink>
            </>
          )}
        </div>

        {/* Botones de usuario */}
        <div className="d-flex align-items-center gap-2">

          {/* Comprador */}
          {tokenComprador ? (
            <>
              <span className="fw-bold text-dark gothic-font-user">🛒 {compradorUsername}</span>
              <Link to="/mi-carrito">
                <button className="btn btn-dark btn-sm gothic-font-user">Mi Carrito</button>
              </Link>
              <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutComprador}>
                Salir Comprador
              </button>
            </>
          ) : null}

          {/* Vendedor */}
          {tokenVendedor && !tokenComprador && (
            <>
              <Link to="/vendedor/dashboard">
                <button className="btn btn-dark btn-sm gothic-font-user">Dashboard</button>
              </Link>
              <span className="fw-bold text-dark gothic-font-user">👋 {vendedorUsername}</span>
              <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutVendedor}>
                Salir Vendedor
              </button>
            </>
          )}

          {/* Admin */}
          {tokenUserAdmin && !tokenComprador && (
            <>
              <Link to="/useradmin">
                <button className="btn btn-dark btn-sm gothic-font-user">Admin</button>
              </Link>
              <span className="fw-bold text-dark gothic-font-user">👋 {userAdminEmail}</span>
              <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutUserAdmin}>
                Salir Admin
              </button>
            </>
          )}

          {/* Login botones solo si nadie está logueado */}
          {!tokenComprador && !tokenVendedor && !tokenUserAdmin && (
            <>
              <Link to="/comprador/login">
                <button className="btn btn-dark btn-sm gothic-font-user">Login Comprador</button>
              </Link>
              <Link to="/vendedor/login">
                <button className="btn btn-dark btn-sm gothic-font-user">Login Vendedor</button>
              </Link>
              <Link to="/useradmin/login">
                <button className="btn btn-dark btn-sm gothic-font-user">Login Admin</button>
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};
