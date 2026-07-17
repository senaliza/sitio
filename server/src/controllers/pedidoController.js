import path from 'path';
import crypto from 'crypto';
import pool from '../config/db.js';
import { codigoPedido } from '../utils/helpers.js';
import { privadoDir } from '../middleware/upload.js';
import { str, email as validarEmail, enumOr } from '../utils/sanitize.js';

/**
 * POST /api/pedidos  (público)
 * body: { cliente: {...}, items: [{ producto_id, cantidad }], metodo_pago, notas, requiere_entrega, zona_entrega, direccion_entrega, indicaciones_entrega }
 * metodo_pago: 'sinpe' | 'whatsapp' | 'transferencia_bancaria'
 * zona_entrega: 'gam' | 'fuera_gam' (solo si requiere_entrega)
 *
 * El total se calcula EN EL SERVIDOR leyendo el precio plano real de cada
 * producto desde la base de datos. NO se confía en precios enviados por el
 * cliente y NO se suma IVA. Total = suma de (precio * cantidad).
 */
export async function crear(req, res) {
  const conn = await pool.getConnection();
  try {
    const { cliente = {}, items = [] } = req.body;

    // Saneamiento de datos del cliente (topes de longitud, vacíos → null).
    const nombre = str(cliente.nombre, 120);
    const telefono = str(cliente.telefono, 40);
    const clienteEmail = validarEmail(cliente.email);
    const empresa = str(cliente.empresa, 120);
    const notas = str(req.body.notas, 1000);
    const direccion_entrega = str(req.body.direccion_entrega, 400);
    const indicaciones_entrega = str(req.body.indicaciones_entrega, 400);
    // Enums controlados: nunca se confía en el valor crudo del cliente.
    const metodo_pago = enumOr(req.body.metodo_pago, ['sinpe', 'whatsapp', 'transferencia_bancaria'], 'sinpe');
    const requiere_entrega = req.body.requiere_entrega ? 1 : 0;
    const zona_entrega = requiere_entrega ? enumOr(req.body.zona_entrega, ['gam', 'fuera_gam'], 'gam') : null;

    if (!nombre || !telefono)
      return res.status(400).json({ error: 'Nombre y teléfono del cliente son obligatorios' });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'El pedido no tiene productos' });
    if (items.length > 200)
      return res.status(400).json({ error: 'Demasiados productos en un solo pedido' });

    // Cargar precios reales (planos, sin IVA) desde la BD
    const ids = items.map((i) => Number(i.producto_id)).filter(Boolean);
    if (!ids.length) return res.status(400).json({ error: 'Productos inválidos' });

    const [productos] = await conn.query(
      `SELECT id, nombre, precio FROM productos WHERE id IN (?) AND activo = 1`,
      [ids]
    );
    const mapa = new Map(productos.map((p) => [p.id, p]));

    const detalle = [];
    let total = 0;
    for (const item of items) {
      const prod = mapa.get(Number(item.producto_id));
      if (!prod) continue;
      if (prod.precio == null) continue; // productos "solo cotización" no van al carrito
      const cantidad = Math.max(1, Number(item.cantidad) || 1);
      const precioUnitario = Number(prod.precio); // monto final plano
      const subtotal = precioUnitario * cantidad; // sin IVA
      total += subtotal;
      detalle.push({
        producto_id: prod.id,
        producto_nombre: prod.nombre,
        precio_unitario: precioUnitario,
        cantidad,
        subtotal,
      });
    }

    if (!detalle.length)
      return res.status(400).json({ error: 'No hay productos válidos con precio' });

    await conn.beginTransaction();

    // Usamos un placeholder ÚNICO (no 'TMP' fijo) porque `codigo` tiene UNIQUE.
    // Longitud segura < 20 chars (VARCHAR(20) NOT NULL UNIQUE).
    // Evita colisiones concurrentes y filas huérfanas 'TMP' de fallos previos (post ALTER, crashes, etc.).
    const tempCodigo = `T${Date.now().toString(36).slice(-5)}${Math.random().toString(36).slice(2, 6)}`;
    // Token de acceso: solo quien recibe la respuesta de este POST lo conoce.
    // Se exige para subir el comprobante de ESTE pedido (evita que cualquiera
    // adjunte/lea comprobantes de pedidos ajenos con solo adivinar el :id).
    const uploadToken = crypto.randomBytes(24).toString('hex');
    const [pedidoRes] = await conn.query(
      `INSERT INTO pedidos
       (codigo, cliente_nombre, cliente_telefono, cliente_email, cliente_empresa,
        requiere_entrega, zona_entrega, direccion_entrega, indicaciones_entrega,
        notas, metodo_pago, total, estado, estado_pago, upload_token)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tempCodigo, nombre, telefono, clienteEmail,
       empresa,
       requiere_entrega, zona_entrega, direccion_entrega, indicaciones_entrega,
       notas, metodo_pago, total, 'pendiente', 'pendiente', uploadToken]
    );
    const pedidoId = pedidoRes.insertId;
    const codigo = codigoPedido(pedidoId);
    await conn.query('UPDATE pedidos SET codigo = ? WHERE id = ?', [codigo, pedidoId]);

    for (const d of detalle) {
      await conn.query(
        `INSERT INTO pedido_detalle
         (pedido_id, producto_id, producto_nombre, precio_unitario, cantidad, subtotal)
         VALUES (?,?,?,?,?,?)`,
        [pedidoId, d.producto_id, d.producto_nombre, d.precio_unitario, d.cantidad, d.subtotal]
      );
    }

    await conn.commit();
    // El token solo se entrega aquí, una única vez, a quien creó el pedido.
    res.status(201).json({ id: pedidoId, codigo, total, token: uploadToken });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (rbErr) {
      console.error('pedidos.crear: rollback falló:', rbErr);
    }
    // Log detallado para diagnosticar rápido (especialmente después de ALTER TABLE: enum, columnas NOT NULL, etc.)
    console.error('pedidos.crear ERROR:', {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      sqlState: err?.sqlState,
      sqlMessage: err?.sqlMessage,
      sql: err?.sql,
      stack: err?.stack?.split('\n').slice(0, 3).join('\n'),
    });
    // Extra: si es error de MySQL, muestra el query que falló de forma clara
    if (err?.sql) {
      console.error('Query que falló:', err.sql);
    }
    if (err?.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err?.sqlMessage?.includes('metodo_pago')) {
      console.error('>>> POSIBLE CAUSA: El ENUM de metodo_pago en la BD no incluye "transferencia_bancaria". Revisa el ALTER del enum.');
    }
    res.status(500).json({ error: 'Error al crear el pedido' });
  } finally {
    conn.release();
  }
}

// GET /api/admin/pedidos (privado)
export async function listar(_req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('pedidos.listar:', err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
}

// GET /api/admin/pedidos/:id (privado) — con detalle y comprobantes
export async function obtener(req, res) {
  try {
    const [[pedido]] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    const [detalle] = await pool.query(
      'SELECT * FROM pedido_detalle WHERE pedido_id = ?', [req.params.id]
    );
    const [comprobantes] = await pool.query(
      'SELECT * FROM comprobantes WHERE pedido_id = ?', [req.params.id]
    );
    res.json({ ...pedido, detalle, comprobantes });
  } catch (err) {
    console.error('pedidos.obtener:', err);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
}

// PATCH /api/admin/pedidos/:id/estado (privado)
export async function cambiarEstado(req, res) {
  try {
    const { estado, estado_pago } = req.body;
    const fields = [];
    const params = [];
    if (estado) { fields.push('estado = ?'); params.push(estado); }
    if (estado_pago) { fields.push('estado_pago = ?'); params.push(estado_pago); }
    if (!fields.length) return res.status(400).json({ error: 'Nada que actualizar' });
    params.push(req.params.id);
    await pool.query(`UPDATE pedidos SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ ok: true });
  } catch (err) {
    console.error('pedidos.cambiarEstado:', err);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
}

// POST /api/pedidos/:id/comprobante (público, requiere el token del pedido)
// — subir comprobante (SINPE o transferencia bancaria)
export async function subirComprobante(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });

    const [[pedido]] = await pool.query(
      'SELECT upload_token FROM pedidos WHERE id = ?', [req.params.id]
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    const { referencia, token } = req.body;
    if (!token || token !== pedido.upload_token) {
      return res.status(403).json({ error: 'No autorizado para este pedido' });
    }

    await pool.query(
      'INSERT INTO comprobantes (pedido_id, archivo, referencia) VALUES (?,?,?)',
      [req.params.id, req.file.filename, referencia || null]
    );
    // El pedido pasa a 'en_revision'; NO se confirma automáticamente (admin valida el comprobante)
    await pool.query(
      "UPDATE pedidos SET estado = 'en_revision' WHERE id = ?",
      [req.params.id]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('pedidos.subirComprobante:', err);
    res.status(500).json({ error: 'Error al subir el comprobante' });
  }
}

// GET /api/admin/comprobantes/:id/archivo (privado) — sirve el archivo real.
// El nombre de archivo nunca lo elige el cliente: se busca en la BD por id.
export async function verComprobante(req, res) {
  try {
    const [[c]] = await pool.query(
      'SELECT archivo FROM comprobantes WHERE id = ?', [req.params.id]
    );
    if (!c) return res.status(404).json({ error: 'Comprobante no encontrado' });
    res.sendFile(path.join(privadoDir, path.basename(c.archivo)), (err) => {
      if (err && !res.headersSent) res.status(404).json({ error: 'Archivo no encontrado' });
    });
  } catch (err) {
    console.error('pedidos.verComprobante:', err);
    res.status(500).json({ error: 'Error al obtener el comprobante' });
  }
}

// PATCH /api/admin/comprobantes/:id/validar (privado)
export async function validarComprobante(req, res) {
  try {
    await pool.query('UPDATE comprobantes SET validado = 1 WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('pedidos.validarComprobante:', err);
    res.status(500).json({ error: 'Error al validar el comprobante' });
  }
}
