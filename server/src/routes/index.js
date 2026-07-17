import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { loginLimiter, publicWriteLimiter } from '../middleware/rateLimit.js';

import * as authC from '../controllers/authController.js';
import * as prodC from '../controllers/productoController.js';
import * as catC from '../controllers/categoriaController.js';
import * as pedC from '../controllers/pedidoController.js';
import * as cotC from '../controllers/cotizacionController.js';
import * as contC from '../controllers/contenidoController.js';
import * as contactoC from '../controllers/contactoController.js';

const router = Router();

/* ---------- Auth ---------- */
router.post('/auth/login', loginLimiter, authC.login);
router.get('/auth/me', auth, authC.me);

/* ---------- Público ---------- */
router.get('/productos', prodC.listar);
router.get('/productos/:slug', prodC.obtener);
router.get('/categorias', catC.listar);
router.get('/contenido', contC.obtener);

router.post('/pedidos', publicWriteLimiter, pedC.crear);
router.post('/pedidos/:id/comprobante', publicWriteLimiter, upload.single('comprobante'), pedC.subirComprobante);
router.post('/cotizaciones', publicWriteLimiter, upload.single('archivo'), cotC.crear);
router.post('/contacto', publicWriteLimiter, contactoC.enviar);

/* ---------- Admin (protegido con JWT) ---------- */
// Productos
router.post('/admin/productos', auth, upload.single('imagen'), prodC.crear);
router.put('/admin/productos/:id', auth, upload.single('imagen'), prodC.actualizar);
router.delete('/admin/productos/:id', auth, prodC.eliminar);

// Categorías / subcategorías
router.post('/admin/categorias', auth, catC.crear);
router.put('/admin/categorias/:id', auth, catC.actualizar);
router.delete('/admin/categorias/:id', auth, catC.eliminar);
router.post('/admin/subcategorias', auth, catC.crearSub);

// Pedidos / pagos
router.get('/admin/pedidos', auth, pedC.listar);
router.get('/admin/pedidos/:id', auth, pedC.obtener);
router.patch('/admin/pedidos/:id/estado', auth, pedC.cambiarEstado);
router.patch('/admin/comprobantes/:id/validar', auth, pedC.validarComprobante);
router.get('/admin/comprobantes/:id/archivo', auth, pedC.verComprobante);

// Cotizaciones
router.get('/admin/cotizaciones', auth, cotC.listar);
router.patch('/admin/cotizaciones/:id/estado', auth, cotC.cambiarEstado);
router.get('/admin/cotizaciones/:id/archivo', auth, cotC.verArchivo);

// Contenido editable
router.put('/admin/contenido', auth, contC.actualizar);

export default router;
