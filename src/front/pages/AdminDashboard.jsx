import React from "react";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  
    //Estos numeros son de ejemplo
  const resumen = {
    totalCompradores: 120,
    totalVendedores: 15,
    ventasMes: 250,
  };

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>
      <p>Bienvenido al panel de administración. ¿Qué quieres gestionar?</p>

      <div className="d-flex flex-column gap-3 mt-4">
        <Link to="/compradores" className="btn btn-outline-primary">
          Gestionar Compradores
        </Link>
        <Link to="/vendedores" className="btn btn-outline-primary">
          Gestionar Vendedores
        </Link>
        <Link to="/productos" className="btn btn-outline-success">
          Gestionar Productos
        </Link>
        <Link to="/ventas" className="btn btn-outline-warning">
          Ver Ventas
        </Link>
        <Link to="/" className="btn btn-secondary">
          Volver al Inicio
        </Link>
      </div>

      
      <div className="mt-5 p-3 border rounded bg-light">
        <h5>Resumen rápido</h5>
        <ul>
          <li>Total compradores: <strong>{resumen.totalCompradores}</strong></li>
          <li>Total vendedores: <strong>{resumen.totalVendedores}</strong></li>
          <li>Ventas del mes: <strong>{resumen.ventasMes}</strong></li>
        </ul>
      </div>
    </div>
  );
};