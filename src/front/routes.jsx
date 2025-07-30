import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { VendedoresLista } from "./pages/VendedorLista";
import { VendedorForm } from "./pages/VendedorForm";
import { VendedorDetalle } from "./pages/VendedorDetalle"; 
import { CompradorLista } from "./pages/CompradorLista";
import { CompradorForm } from "./pages/CompradorForm";
import { ProductoLista } from "./pages/ProductoLista";
import { ProductoForm } from "./pages/ProductoForm";
import { ProductoDetalle } from "./pages/ProductoDetalle";



export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/productos" element={<ProductoLista />} />
      <Route path="/productos/nuevo" element={<ProductoForm />} />
      <Route path="/productos/editar/:id" element={<ProductoForm />} />
      <Route path="/productos/detalles/:id" element={<ProductoDetalle />} />
      <Route path="/vendedores" element={<VendedoresLista />} />
      <Route path="/vendedores/crear" element={<VendedorForm />} />
      <Route path="/vendedores/editar/:id" element={<VendedorForm />} />
      <Route path="/vendedores/:id/detalles" element={<VendedorDetalle />} />
      <Route path="/compradores" element={<CompradorLista />} />
      <Route path="/compradores/nuevo" element={<CompradorForm />} />
      <Route path="/compradores/editar/:id" element={<CompradorForm />} />
    </Route>
  )
);
