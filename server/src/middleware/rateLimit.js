import rateLimit from 'express-rate-limit';

/*
 * Limitadores de tasa por IP. Protegen contra fuerza bruta (login) y abuso
 * de los formularios públicos (spam de pedidos/cotizaciones/contacto).
 *
 * Nota: en desarrollo los topes se relajan para no estorbar las pruebas.
 */
const esProd = process.env.NODE_ENV === 'production';

const comun = {
  standardHeaders: true, // devuelve cabeceras RateLimit-*
  legacyHeaders: false,
};

// Login: estricto. Frena el brute-force de contraseñas del panel admin.
// Cuenta solo los intentos fallidos (skipSuccessfulRequests) para no castigar
// a un admin legítimo que entra bien varias veces.
export const loginLimiter = rateLimit({
  ...comun,
  windowMs: 15 * 60 * 1000, // 15 min
  max: esProd ? 10 : 100,
  skipSuccessfulRequests: true,
  message: { error: 'Demasiados intentos de inicio de sesión. Espere unos minutos e intente de nuevo.' },
});

// Formularios públicos (pedidos, cotizaciones, contacto): moderado.
// Permite uso normal de un cliente pero corta scripts que envían en masa.
export const publicWriteLimiter = rateLimit({
  ...comun,
  windowMs: 10 * 60 * 1000, // 10 min
  max: esProd ? 30 : 300,
  message: { error: 'Demasiadas solicitudes. Espere unos minutos e intente de nuevo.' },
});
