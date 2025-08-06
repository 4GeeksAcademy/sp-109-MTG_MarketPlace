import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Rutas privadas
import { RutaPrivadaVendedor } from "./components/RutaPrivadaVendedor";
import { RutaPrivadaComprador } from "./components/RutaPrivadaComprador"; // <-- Importa la ruta privada comprador

// Vendedor
import { VendedoresLista } from "./pages/VendedorLista";
import { VendedorForm } from "./pages/VendedorForm";
import { VendedorDetalle } from "./pages/VendedorDetalle";
import { VendedorLogin } from "./pages/VendedorLogin";
import { VendedorRegistro } from "./pages/VendedorRegistro";

// Comprador
import { CompradorLista } from "./pages/CompradorLista";
import { CompradorForm } from "./pages/CompradorForm";
import { CompradorDetalle } from "./pages/CompradorDetalle";
import { CompradorLogin } from "./pages/CompradorLogin";       
import { CompradorRegistro } from "./pages/CompradorRegistro"; 

// Admin
import { AdminLista } from "./pages/AdminLista";
import { AdminForm } from "./pages/AdminForm";
import { AdminDetalle } from "./pages/AdminDetalle";

// Producto
import { ProductoLista } from "./pages/ProductoLista";
import { ProductoForm } from "./pages/ProductoForm";
import { ProductoDetalle } from "./pages/ProductoDetalle";

// Carrito
import { CarritoLista } from "./pages/CarritoLista";
import { CarritoForm } from "./pages/CarritoForm";
import { CarritoDetalles } from "./pages/CarritoDetalle";

// Ítem Carrito
import { ItemCarritoLista } from "./pages/ItemCarritoLista";
import { ItemCarritoForm } from "./pages/ItemCarritoForm";
import { ItemCarritoDetalle } from "./pages/ItemCarritoDetalle";

// Checkout
import { Checkout } from "./pages/Checkout"; 

import { CategoriaLista } from "./pages/CategoriaLista";
import { CategoriaForm } from "./pages/CategoriaForm";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Página principal */}
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />

      <Route path="/single/:theId" element={<Single />} />

      {/* Vendedores */}
      <Route path="/vendedor/login" element={<VendedorLogin />} />
      <Route path="/vendedor/registro" element={<VendedorRegistro />} />
      <Route
        path="/vendedores"
        element={
          <RutaPrivadaVendedor>
            <VendedoresLista />
          </RutaPrivadaVendedor>
        }
      />
      <Route
        path="/vendedores/crear"
        element={
          <RutaPrivadaVendedor>
            <VendedorForm />
          </RutaPrivadaVendedor>
        }
      />
      <Route
        path="/vendedores/editar/:id"
        element={
          <RutaPrivadaVendedor>
            <VendedorForm />
          </RutaPrivadaVendedor>
        }
      />
      <Route
        path="/vendedores/:id/detalles"
        element={
          <RutaPrivadaVendedor>
            <VendedorDetalle />
          </RutaPrivadaVendedor>
        }
      />

      {/* Compradores */}
      <Route path="/comprador/login" element={<CompradorLogin />} />
      <Route path="/comprador/registro" element={<CompradorRegistro />} />
      <Route
        path="/compradores"
        element={
          <RutaPrivadaComprador>
            <CompradorLista />
          </RutaPrivadaComprador>
        }
      />
      <Route
        path="/compradores/nuevo"
        element={
          <RutaPrivadaComprador>
            <CompradorForm />
          </RutaPrivadaComprador>
        }
      />
      <Route
        path="/compradores/editar/:id"
        element={
          <RutaPrivadaComprador>
            <CompradorForm />
          </RutaPrivadaComprador>
        }
      />
      <Route
        path="/compradores/:id/detalles"
        element={
          <RutaPrivadaComprador>
            <CompradorDetalle />
          </RutaPrivadaComprador>
        }
      />

      {/* Admin */}
      <Route path="/admins" element={<AdminLista />} />
      <Route path="/admins/crear" element={<AdminForm />} />
      <Route path="/admins/editar/:id" element={<AdminForm />} />
      <Route path="/admins/:id/detalles" element={<AdminDetalle />} />

      {/* Categorías */}
      <Route path="/categorias" element={<CategoriaLista />} />
      <Route path="/categorias/nuevo" element={<CategoriaForm />} />
      <Route path="/categorias/editar/:id" element={<CategoriaForm />} />

      {/* Carritos */}
      <Route path="/carritos" element={<CarritoLista />} />
      <Route path="/carritos/nuevo" element={<CarritoForm />} />
      <Route path="/carritos/editar/:id" element={<CarritoForm />} />
      <Route path="/carritos/detalles/:id" element={<CarritoDetalles />} />

      {/* Ítems del carrito */}
      <Route path="/itemcarrito" element={<ItemCarritoLista />} />
      <Route path="/itemcarrito/nuevo" element={<ItemCarritoForm />} />
      <Route path="/itemcarrito/editar/:id" element={<ItemCarritoForm />} />
      <Route path="/itemcarrito/detalles/:id" element={<ItemCarritoDetalle />} />

      {/* Checkout */}
      <Route path="/checkout" element={<Checkout />} /> 
    </Route>
  )
);
