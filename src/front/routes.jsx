import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Rutas privadas
import { RutaPrivadaVendedor } from "./components/RutaPrivadaVendedor";
import { RutaPrivadaUserAdmin } from "./components/RutaPrivadaUserAdmin";

// Vendedor
import { VendedoresLista } from "./pages/VendedorLista";
import { VendedorForm } from "./pages/VendedorForm";
import { VendedorDetalle } from "./pages/VendedorDetalle";
import { VendedorLogin } from "./pages/VendedorLogin";
import { VendedorRegistro } from "./pages/VendedorRegistro";
import { VendedorDashboard } from "./pages/VendedorDashboard";
import { VendedorReportes } from "./pages/VendedorReportes";
import { VendedorOrders } from "./pages/VendedorOrders";
import { VendedorProcesarOrden } from "./pages/VendedorProcesarOrden";
import { VendedorPerfil } from "./pages/VendedorPerfil.jsx";

// Comprador
import  {CompradorLista}  from "./pages/CompradorLista";
import { CompradorForm } from "./pages/CompradorForm";
import { CompradorDetalle } from "./pages/CompradorDetalle";
import { CompradorLogin } from "./pages/CompradorLogin";
import { CompradorRegistro } from "./pages/CompradorRegistro";

// Producto
import { ProductoLista } from "./pages/ProductoLista";
import { ProductoForm } from "./pages/ProductoForm";
import { ProductoDetalle } from "./pages/ProductoDetalle";

// Carrito
import { CarritoLista } from "./pages/CarritoLista";
import { CarritoForm } from "./pages/CarritoForm";
import { CarritoDetalles } from "./pages/CarritoDetalle";
import Checkout from "./pages/Checkout.jsx";
import  Receipt  from "./pages/Receipt";

// Ítem Carrito
import { ItemCarritoLista } from "./pages/ItemCarritoLista";
import { ItemCarritoForm } from "./pages/ItemCarritoForm";
import { ItemCarritoDetalle } from "./pages/ItemCarritoDetalle";

// Categorías
import { CategoriaLista } from "./pages/CategoriaLista";
import { CategoriaForm } from "./pages/CategoriaForm";
import { CategoriaDetalle } from "./pages/CategoriaDetalle";

// Producto-Categorías
import { ProductoCategoriaLista } from "./pages/ProductoCategoriaLista.jsx";
import { ProductoCategoriaForm } from "./pages/ProductoCategoriaForm.jsx";
import { ProductoCategoriaDetalle } from "./pages/ProductoCategoriaDetalle.jsx";

// UserAdmin
import { UserAdminLogin } from "./pages/UserAdminLogin";
import { UserAdminForm } from "./pages/UserAdminForm";
import { UserAdminLista } from "./pages/UserAdminLista";
import { UserAdminDetalle } from "./pages/UserAdminDetalle.jsx";
import { UserAdminRoute } from "./pages/UserAdminRoute.jsx";

import { CarritoUserAdminLista } from "./pages/CarritoUserAdminLista";
import { CarritoUserAdminDetalle } from "./pages/CarritoUserAdminDetalle.jsx";

import { OrdenesUserAdminLista } from "./pages/OrdenesUserAdminLista";
import { OrdenesUserAdminDetalle } from "./pages/OrdenesUserAdminDetalle";

// Tienda
import { Tienda } from "./pages/Tienda";
import { TiendaDetalles } from "./pages/TiendaDetalles";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/single/:theId" element={<Single />} />

      {/* Autenticación Vendedor */}
      <Route path="/vendedor/login" element={<VendedorLogin />} />
      <Route path="/vendedor/registro" element={<VendedorRegistro />} />

      {/* Vendedores */}
      <Route path="/vendedores" element={<RutaPrivadaVendedor><VendedoresLista /></RutaPrivadaVendedor>} />
      <Route path="/vendedores/crear" element={<RutaPrivadaVendedor><VendedorForm /></RutaPrivadaVendedor>} />
      <Route path="/vendedores/editar/:id" element={<RutaPrivadaVendedor><VendedorForm /></RutaPrivadaVendedor>} />
      <Route path="/vendedores/:id/detalles" element={<RutaPrivadaVendedor><VendedorDetalle /></RutaPrivadaVendedor>} />

      {/* Dashboard/Reportes/Órdenes Vendedor */}
      <Route path="/vendedor/dashboard" element={<RutaPrivadaVendedor><VendedorDashboard /></RutaPrivadaVendedor>} />
      <Route path="/vendedor/reportes" element={<RutaPrivadaVendedor><VendedorReportes /></RutaPrivadaVendedor>} />
      <Route path="/vendedor/orders" element={<RutaPrivadaVendedor><VendedorOrders /></RutaPrivadaVendedor>} />
      <Route path="/vendedor/orden/:itemId/procesar" element={<RutaPrivadaVendedor><VendedorProcesarOrden /></RutaPrivadaVendedor>} />
      <Route path="/vendedor/perfil" element={<RutaPrivadaVendedor><VendedorPerfil /></RutaPrivadaVendedor>} />

      {/* Admin Vendedores 
      <Route path="/admin/vendedores" element={<UserAdminRoute><VendedoresLista /></UserAdminRoute>} />
      <Route path="/admin/vendedores/crear" element={<UserAdminRoute><VendedorForm /></UserAdminRoute>} />
      <Route path="/admin/vendedores/:id/detalles" element={<UserAdminRoute><VendedorDetalle /></UserAdminRoute>} />
      <Route path="/admin/vendedores/editar/:id" element={<UserAdminRoute><VendedorForm /></UserAdminRoute>} />*/}

      {/* Productos */}
      <Route path="/productos" element={<RutaPrivadaVendedor><ProductoLista /></RutaPrivadaVendedor>} />
      <Route path="/productos/nuevo" element={<RutaPrivadaVendedor><ProductoForm /></RutaPrivadaVendedor>} />
      <Route path="/productos/editar/:id" element={<RutaPrivadaVendedor><ProductoForm /></RutaPrivadaVendedor>} />
      <Route path="/productos/detalles/:id" element={<RutaPrivadaVendedor><ProductoDetalle /></RutaPrivadaVendedor>} />


      {/* Autenticación Comprador */}
      <Route path="/comprador/login" element={<CompradorLogin />} />
      <Route path="/comprador/registro" element={<CompradorRegistro />} />

      {/* Compradores */}
      <Route path="/compradores" element={<CompradorLista />} />
      <Route path="/compradores/nuevo" element={<CompradorForm />} />
      <Route path="/compradores/editar/:id" element={<CompradorForm />} />
      <Route path="/compradores/:id/detalles" element={<CompradorDetalle />} />

      {/* Categorías */}
      <Route path="/categorias" element={<CategoriaLista />} />
      <Route path="/categorias/nuevo" element={<CategoriaForm />} />
      <Route path="/categorias/editar/:id" element={<CategoriaForm />} />
      <Route path="/categorias/:id/detalles" element={<CategoriaDetalle />} />

      {/* Carritos */}
      <Route path="/carritos" element={<CarritoLista />} />
      <Route path="/carritos/nuevo" element={<CarritoForm />} />
      <Route path="/carritos/editar/:id" element={<CarritoForm />} />
      <Route path="/carritos/detalles/:id" element={<CarritoDetalles />} />

      {/* Ítems Carrito */}
      <Route path="/itemcarrito" element={<ItemCarritoLista />} />
      <Route path="/itemcarrito/nuevo" element={<ItemCarritoForm />} />
      <Route path="/itemcarrito/editar/:id" element={<ItemCarritoForm />} />
      <Route path="/itemcarrito/detalles/:id" element={<ItemCarritoDetalle />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/receipt" element={<Receipt />} />
      {/* Producto-Categorías */}
      <Route path="/producto-categoria" element={<ProductoCategoriaLista />} />
      <Route path="/producto-categoria/nuevo" element={<ProductoCategoriaForm />} />
      <Route path="/producto-categoria/editar/:id" element={<ProductoCategoriaForm />} />
      <Route path="/producto-categoria/:id" element={<ProductoCategoriaDetalle />} />

      {/* UserAdmin */}
      <Route path="/useradmin/login" element={<UserAdminLogin />} />
      <Route path="/useradmin/register" element={<RutaPrivadaUserAdmin><UserAdminForm /></RutaPrivadaUserAdmin>} />
      <Route path="/useradmin" element={<RutaPrivadaUserAdmin><UserAdminLista /></RutaPrivadaUserAdmin>} />
      <Route path="/useradmin/:id/detalles" element={<RutaPrivadaUserAdmin><UserAdminDetalle /></RutaPrivadaUserAdmin>} />
      <Route path="/useradmin/editar/:id" element={<RutaPrivadaUserAdmin><UserAdminForm /></RutaPrivadaUserAdmin>} />

      {/* UserAdmin: Carritos y Órdenes */}
      <Route path="/useradmin/carrito" element={<CarritoUserAdminLista />} />
      <Route path="/user/admin/carritos/detalles/:id" element={<RutaPrivadaUserAdmin><CarritoUserAdminDetalle /></RutaPrivadaUserAdmin>} />
      <Route path="/useradmin/ordenes" element={<RutaPrivadaUserAdmin><OrdenesUserAdminLista /></RutaPrivadaUserAdmin>} />
      <Route path="/user/admin/ordenes/detalles/:id" element={<RutaPrivadaUserAdmin><OrdenesUserAdminDetalle /></RutaPrivadaUserAdmin>} />

      {/* UserAdmin: Vendedores */}
      <Route path="/useradmin/vendedores" element={<UserAdminRoute><VendedoresLista /></UserAdminRoute>} />
      <Route path="/useradmin/vendedores/crear" element={<UserAdminRoute><VendedorForm /></UserAdminRoute>} />
      <Route path="/useradmin/vendedores/:id/detalles" element={<UserAdminRoute><VendedorDetalle /></UserAdminRoute>} />
      <Route path="/useradmin/vendedores/editar/:id" element={<UserAdminRoute><VendedorForm /></UserAdminRoute>} />

      {/* UserAdmin: Vendedores */} 
      <Route path="/tienda" element={<Tienda />} />
       <Route path="/tienda/detalles/:id" element={<TiendaDetalles />} />

    </Route>
  )
);