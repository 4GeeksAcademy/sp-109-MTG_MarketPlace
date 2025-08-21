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

                {/* Botón Tienda grande */}
                <div className="mx-auto">
                    <NavLink
                        to="/tienda"
                        className={({ isActive }) =>
                            `btn gothic-font-tienda ${isActive ? "btn-secondary text-white" : "btn-link text-dark"} text-decoration-none`
                        }
                    >
                        Tienda
                    </NavLink>
                </div>

                {/* Botones de usuario en negro con letra gótica más pequeña */}
                <div className="d-flex align-items-center gap-2">
                    {/* Comprador */}
                    {tokenComprador ? (
                        <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-dark gothic-font-user">🛒 {compradorUsername}</span>
                            <Link to="/mi-carrito">
                                <button className="btn btn-dark btn-sm gothic-font-user">Mi Carrito</button>
                            </Link>
                            <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutComprador}>
                                Salir Comprador
                            </button>
                        </div>
                    ) : (
                        <Link to="/comprador/login">
                            <button className="btn btn-dark btn-sm gothic-font-user">Login Comprador</button>
                        </Link>
                    )}

                    {/* Vendedor */}
                    {tokenVendedor ? (
                        <div className="d-flex align-items-center gap-2">
                            <Link to="/vendedor/dashboard">
                                <button className="btn btn-dark btn-sm gothic-font-user">Dashboard</button>
                            </Link>
                            <span className="fw-bold text-dark gothic-font-user">👋 {vendedorUsername}</span>
                            <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutVendedor}>
                                Salir Vendedor
                            </button>
                        </div>
                    ) : (
                        <Link to="/vendedor/login">
                            <button className="btn btn-dark btn-sm gothic-font-user">Login Vendedor</button>
                        </Link>
                    )}

                    {/* Admin */}
                    {tokenUserAdmin ? (
                        <div className="d-flex align-items-center gap-2">
                            <Link to="/useradmin">
                                <button className="btn btn-dark btn-sm gothic-font-user">Admin</button>
                            </Link>
                            <span className="fw-bold text-dark gothic-font-user">👋 {userAdminEmail}</span>
                            <button className="btn btn-dark btn-sm gothic-font-user" onClick={handleLogoutUserAdmin}>
                                Salir Admin
                            </button>
                        </div>
                    ) : (
                        <Link to="/useradmin/login">
                            <button className="btn btn-dark btn-sm gothic-font-user">Login Admin</button>
                        </Link>
                    )}


                    {/* ---- PERFIL ---- */}
                     <Link
                        to="/vendedor/perfil"
                        className="btn btn-outline-dark d-flex align-items-center gap-2"
                    >
                        <i className="bi bi-person-circle" style={{ fontSize: "1.2rem" }}></i>
                        <span>Mi Perfil</span>
                    </Link>

                </div>
            </div>
        </nav>
    );
};
