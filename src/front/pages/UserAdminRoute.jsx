import { Navigate, useLocation } from 'react-router-dom';

export const UserAdminRoute = ({ children }) => {
    const token = localStorage.getItem('tokenUserAdmin');
    const location = useLocation();

    if (!token) {
        // 🔽 CAMBIO: Solo pasamos la ruta (pathname), que es un string.
        return <Navigate to="/vendedor/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

