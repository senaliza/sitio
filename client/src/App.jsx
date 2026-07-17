import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ContenidoProvider } from './context/ContenidoContext.jsx';
import { CarritoProvider } from './context/CarritoContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Productos from './pages/Productos.jsx';
import Catalogo from './pages/Catalogo.jsx';
import ProductoDetalle from './pages/ProductoDetalle.jsx';
import Cotizar from './pages/Cotizar.jsx';
import Carrito from './pages/Carrito.jsx';
import Checkout from './pages/Checkout.jsx';
import Contacto from './pages/Contacto.jsx';

import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProductos from './pages/admin/AdminProductos.jsx';
import AdminCategorias from './pages/admin/AdminCategorias.jsx';
import AdminPedidos from './pages/admin/AdminPedidos.jsx';
import AdminCotizaciones from './pages/admin/AdminCotizaciones.jsx';
import AdminContenido from './pages/admin/AdminContenido.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContenidoProvider>
          <CarritoProvider>
            <Routes>
              {/* Sitio público */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="nosotros" element={<Nosotros />} />
                <Route path="productos" element={<Productos />} />
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="producto/:slug" element={<ProductoDetalle />} />
                <Route path="cotizar" element={<Cotizar />} />
                <Route path="carrito" element={<Carrito />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="contacto" element={<Contacto />} />
              </Route>

              {/* Administración */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="categorias" element={<AdminCategorias />} />
                <Route path="pedidos" element={<AdminPedidos />} />
                <Route path="cotizaciones" element={<AdminCotizaciones />} />
                <Route path="contenido" element={<AdminContenido />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CarritoProvider>
        </ContenidoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
