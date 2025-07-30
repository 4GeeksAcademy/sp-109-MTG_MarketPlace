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

import { CompradorLista } from "./pages/CompradorLista";
import { CompradorForm } from "./pages/CompradorForm";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/vendedores" element={<VendedoresLista />} />
      <Route path="/vendedores/nuevo" element={<VendedorForm />} />
      <Route path="/vendedores/editar/:id" element={<VendedorForm />} />

      <Route path="/compradores" element={<CompradorLista />} />
      <Route path="/compradores/nuevo" element={<CompradorForm />} />
      <Route path="/compradores/editar/:id" element={<CompradorForm />} />
    </Route>
  )
);
