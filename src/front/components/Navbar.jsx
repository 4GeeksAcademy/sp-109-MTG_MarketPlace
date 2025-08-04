import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();
    const tokenVendedor = localStorage.getItem("tokenVendedor");
    const vendedorUsername = localStorage.getItem("vendedorUsername");

    const handleLogout = () => {
        localStorage.removeItem("tokenVendedor");
        localStorage.removeItem("vendedorUsername");
        navigate("/vendedor/login");
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
                    <Link to="/producto-categoria"> 
                     <button className="btn btn-secondary">Producto-Categoria</button>    
                    </Link>



                    {tokenVendedor ? (
                        <div className="d-flex align-items-center gap-2 ms-3">
                            <span className="fw-bold text-dark">👋 {vendedorUsername}</span>
                            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <Link to="/vendedor/login" className="ms-2">
                            <button className="btn btn-outline-success btn-sm">
                                Iniciar sesión
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};