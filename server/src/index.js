import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './routes/index.js';

dotenv.config();

// --- Guarda de arranque: sin un JWT_SECRET fuerte no se firma nada seguro. ---
// Con el secreto en placeholder (o vacío) cualquiera puede forjar tokens de
// admin, así que en producción se rechaza el arranque. En desarrollo solo se
// advierte para no bloquear el flujo local.
const JWT_SECRET = process.env.JWT_SECRET || '';
const SECRET_INSEGURO =
  !JWT_SECRET ||
  JWT_SECRET === 'cambie_este_valor_por_uno_seguro' ||
  JWT_SECRET.length < 32;
if (SECRET_INSEGURO) {
  const msg =
    'JWT_SECRET ausente o inseguro. Genere uno con: ' +
    'node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"';
  if (process.env.NODE_ENV === 'production') {
    console.error(`FATAL: ${msg}`);
    process.exit(1);
  }
  console.warn(`ADVERTENCIA: ${msg}`);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Confía en el primer proxy (Netlify/hosting) para que el rate-limit y los
// logs vean la IP real del cliente y no la del balanceador.
app.set('trust proxy', 1);

// Cabeceras de seguridad HTTP. crossOriginResourcePolicy en 'cross-origin'
// para que las imágenes de producto en /uploads se puedan cargar desde el
// frontend (otro origen) sin romperse.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS con allowlist. CLIENT_URL admite varias URLs separadas por comas
// (ej. dominio de producción + preview de Netlify). Si no hay lista definida,
// en desarrollo se permite cualquier origen; en producción se exige lista.
const allowlist = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin(origin, cb) {
      // Peticiones sin Origin (curl, apps móviles, healthchecks) se permiten.
      if (!origin) return cb(null, true);
      if (!allowlist.length) {
        if (process.env.NODE_ENV === 'production') return cb(new Error('CORS: origen no permitido'));
        return cb(null, true); // dev sin CLIENT_URL: abierto
      }
      return allowlist.includes(origin)
        ? cb(null, true)
        : cb(new Error('CORS: origen no permitido'));
    },
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Imágenes de producto: públicas. Los comprobantes y archivos de cotización
// (PII: cédulas, teléfonos, montos) NO se sirven aquí — solo por rutas
// /api/admin/... protegidas con JWT (ver routes/index.js).
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads', 'productos')));

// API
app.use('/api', apiRoutes);

app.get('/', (_req, res) => res.json({ ok: true, servicio: 'Señaliza API' }));

// Manejo de errores (incluye errores de multer)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Señaliza en http://localhost:${PORT}`));
