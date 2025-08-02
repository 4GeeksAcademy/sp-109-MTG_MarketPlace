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

      <Route path="/vendedores" element={
        <RutaPrivadaVendedor>
          <VendedoresLista />
        </RutaPrivadaVendedor>
      } />
      <Route path="/vendedores/crear" element={
        <RutaPrivadaVendedor>
          <VendedorForm />
        </RutaPrivadaVendedor>
      } />
      <Route path="/vendedores/editar/:id" element={
        <RutaPrivadaVendedor>
          <VendedorForm />
        </RutaPrivadaVendedor>
      } />
      <Route path="/vendedores/:id/detalles" element={
        <RutaPrivadaVendedor>
          <VendedorDetalle />
        </RutaPrivadaVendedor>
      } />
      {/* Productos */}
      <Route path="/productos" element={
        <RutaPrivadaVendedor>
          <ProductoLista />
        </RutaPrivadaVendedor>
      } />
      <Route path="/productos/nuevo" element={
        <RutaPrivadaVendedor>
          <ProductoForm />
        </RutaPrivadaVendedor>
      } />
      <Route path="/productos/editar/:id" element={
        <RutaPrivadaVendedor>
          <ProductoForm />
        </RutaPrivadaVendedor>
      } />
      <Route path="/productos/detalles/:id" element={
        <RutaPrivadaVendedor>
          <ProductoDetalle />
        </RutaPrivadaVendedor>
      } />
              
        
      {/* Compradores */}
      <Route path="/compradores" element={<CompradorLista />} />
      <Route path="/compradores/nuevo" element={<CompradorForm />} />
      <Route path="/compradores/editar/:id" element={<CompradorForm />} />
      <Route path="/compradores/:id/detalles" element={<CompradorDetalle />} />
        
        
      {/* Categorias */}
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
    </Route>
  )
);


