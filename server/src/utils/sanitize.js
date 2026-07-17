/*
 * Saneamiento y validación de entradas de los formularios públicos.
 *
 * Objetivo: aceptar solo datos con forma razonable antes de guardarlos o
 * mostrarlos en el panel admin. Recorta espacios, impone topes de longitud
 * (evita payloads gigantes / XSS almacenado abusivo) y normaliza vacíos a null
 * para que la BD guarde NULL en vez de cadenas vacías.
 *
 * El escape de HTML se hace al RENDERIZAR (React escapa solo; los correos usan
 * esc() de mailer.js). Aquí no destruimos el contenido, solo lo acotamos.
 */

// Recorta y limita longitud. Devuelve null si queda vacío.
export function str(value, max = 255) {
  if (value == null) return null;
  const s = String(value).trim().slice(0, max);
  return s.length ? s : null;
}

// Valida forma básica de email. Devuelve el email saneado o null.
export function email(value, max = 160) {
  const s = str(value, max);
  if (!s) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
}

// Restringe un valor a un conjunto permitido; si no coincide, usa el default.
export function enumOr(value, permitidos, porDefecto) {
  return permitidos.includes(value) ? value : porDefecto;
}
