import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">MTG Marketplace</span>
                </Link>
                <div className="ml-auto d-flex gap-2">
                    <Link to="/demo">
                        <button className="btn btn-primary">Check the Context in action</button>
                    </Link>
                    <Link to="/vendedores">
                        <button className="btn btn-secondary">Vendedores</button>
                    </Link>
                    <Link to="/compradores">
                        <button className="btn btn-secondary">Compradores</button>
                    </Link>

                     <Link to="/categorias">
                        <button className="btn btn-secondary">Categorias</button>
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
                </div>
            </div>
        </nav>
    );
};