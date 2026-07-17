import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.join(__dirname, '..', '..', 'uploads');

// Imágenes de producto: públicas, servidas por /uploads (express.static).
export const productosDir = path.join(baseDir, 'productos');
// Comprobantes de pago y archivos de cotización: contienen PII (cédulas,
// teléfonos, montos). NUNCA se sirven como estáticos; solo vía rutas
// protegidas con `auth` que verifican el dueño del recurso.
export const privadoDir = path.join(baseDir, 'privado');

for (const dir of [productosDir, privadoDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const CAMPOS_PRIVADOS = new Set(['comprobante', 'archivo']);

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, CAMPOS_PRIVADOS.has(file.fieldname) ? privadoDir : productosDir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error('Tipo de archivo no permitido'));
  },
});
