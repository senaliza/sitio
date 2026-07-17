const API = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "senaliza_token";

function getToken() {
  return (
    window.__senaliza_token || window.localStorage.getItem(TOKEN_KEY) || null
  );
}
export function setToken(t) {
  window.__senaliza_token = t;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request(
  path,
  { method = "GET", body, auth = false, isForm = false } = {},
) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
}

export const api = {
  // Público
  productos: (q = "") => request(`/productos${q}`),
  producto: (slug) => request(`/productos/${slug}`),
  categorias: () => request("/categorias"),
  contenido: () => request("/contenido"),
  crearPedido: (body) => request("/pedidos", { method: "POST", body }),
  subirComprobante: (id, form) =>
    request(`/pedidos/${id}/comprobante`, {
      method: "POST",
      body: form,
      isForm: true,
    }),
  crearCotizacion: (form) =>
    request("/cotizaciones", { method: "POST", body: form, isForm: true }),
  enviarContacto: (body) =>
    request("/contacto", { method: "POST", body }),

  // Auth
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me", { auth: true }),

  // Admin
  adminProductos: () => request("/productos?incluirInactivos=1"),
  adminCategorias: () => request("/categorias"),
  editarCategoria: (id, body) =>
    request(`/admin/categorias/${id}`, { method: "PUT", body, auth: true }),
  eliminarCategoria: (id) =>
    request(`/admin/categorias/${id}`, { method: "DELETE", auth: true }),
  crearProducto: (form) =>
    request("/admin/productos", {
      method: "POST",
      body: form,
      isForm: true,
      auth: true,
    }),
  editarProducto: (id, form) =>
    request(`/admin/productos/${id}`, {
      method: "PUT",
      body: form,
      isForm: true,
      auth: true,
    }),
  eliminarProducto: (id) =>
    request(`/admin/productos/${id}`, { method: "DELETE", auth: true }),
  crearCategoria: (body) =>
    request("/admin/categorias", { method: "POST", body, auth: true }),
  crearSubcategoria: (body) =>
    request("/admin/subcategorias", { method: "POST", body, auth: true }),
  adminPedidos: () => request("/admin/pedidos", { auth: true }),
  adminPedido: (id) => request(`/admin/pedidos/${id}`, { auth: true }),
  estadoPedido: (id, body) =>
    request(`/admin/pedidos/${id}/estado`, {
      method: "PATCH",
      body,
      auth: true,
    }),
  validarComprobante: (id) =>
    request(`/admin/comprobantes/${id}/validar`, {
      method: "PATCH",
      auth: true,
    }),
  adminCotizaciones: () => request("/admin/cotizaciones", { auth: true }),
  estadoCotizacion: (id, body) =>
    request(`/admin/cotizaciones/${id}/estado`, {
      method: "PATCH",
      body,
      auth: true,
    }),
  guardarContenido: (body) =>
    request("/admin/contenido", { method: "PUT", body, auth: true }),
};

// Formato de moneda en colones. El valor YA es el precio plano final (sin IVA).
export function formatearPrecio(valor) {
  if (valor == null) return null;
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(valor));
}

// Base de los archivos subidos: el mismo origen del API.
// - Dev / mismo dominio: VITE_API_URL = "/api"  -> ruta relativa "/uploads/..."
//   (el proxy de Vite, o el mismo servidor en producción, la resuelve).
// - Dominio/subdominio separado: VITE_API_URL = "https://api.dominio.com/api"
//   -> se antepone "https://api.dominio.com" para que la imagen cargue.
function baseUploads() {
  if (/^https?:\/\//i.test(API)) {
    try { return new URL(API).origin; } catch { return ""; }
  }
  return "";
}

// URL final para una imagen/archivo PÚBLICO subido al servidor (productos).
export function urlImagen(ruta) {
  if (!ruta) return null;
  if (ruta.startsWith("http")) return ruta;
  return `${baseUploads()}${ruta}`;
}

// Abre en una pestaña nueva un archivo PRIVADO (comprobante o adjunto de
// cotización). Estos ya no son accesibles por URL directa: requieren el
// token de admin, así que se piden por fetch autenticado y se muestran
// como blob (un <a href> normal no podría adjuntar el header Authorization).
export async function abrirArchivoPrivado(path) {
  const t = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: t ? { Authorization: `Bearer ${t}` } : {},
  });
  if (!res.ok) throw new Error("No se pudo abrir el archivo");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
