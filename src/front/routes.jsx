import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// Vendedor
import { VendedoresLista } from "./pages/VendedorLista";
import { VendedorForm } from "./pages/VendedorForm";
import { VendedorDetalle } from "./pages/VendedorDetalle";

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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      {/* Página principal */}
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/single/:theId" element={<Single />} />

      {/* Productos */}
      <Route path="/productos" element={<ProductoLista />} />
      <Route path="/productos/nuevo" element={<ProductoForm />} />
      <Route path="/productos/editar/:id" element={<ProductoForm />} />
      <Route path="/productos/detalles/:id" element={<ProductoDetalle />} />

      {/* Vendedores */}
      <Route path="/vendedores" element={<VendedoresLista />} />
      <Route path="/vendedores/crear" element={<VendedorForm />} />
      <Route path="/vendedores/editar/:id" element={<VendedorForm />} />
      <Route path="/vendedores/:id/detalles" element={<VendedorDetalle />} />

      {/* Compradores */}
      <Route path="/compradores" element={<CompradorLista />} />
      <Route path="/compradores/nuevo" element={<CompradorForm />} />
      <Route path="/compradores/editar/:id" element={<CompradorForm />} />
      <Route path="/compradores/:id/detalles" element={<CompradorDetalle />} />

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


