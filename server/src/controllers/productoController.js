import pool from '../config/db.js';
import { slugify } from '../utils/helpers.js';

// GET /api/productos  (público) — con filtros opcionales
export async function listar(req, res) {
  try {
    const { categoria, buscar, destacado, incluirInactivos } = req.query;
    const where = [];
    const params = [];

    if (!incluirInactivos) where.push('p.activo = 1');
    if (categoria) { where.push('c.slug = ?'); params.push(categoria); }
    if (destacado) { where.push('p.destacado = 1'); }
    if (buscar) {
      where.push('(p.nombre LIKE ? OR p.descripcion_corta LIKE ?)');
      params.push(`%${buscar}%`, `%${buscar}%`);
    }

    const sql = `
      SELECT p.*, c.nombre AS categoria_nombre, c.slug AS categoria_slug,
             s.nombre AS subcategoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY p.destacado DESC, p.created_at DESC`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('productos.listar:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
}

// GET /api/productos/:slug  (público)
export async function obtener(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre AS categoria_nombre, c.slug AS categoria_slug,
              s.nombre AS subcategoria_nombre
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN subcategorias s ON p.subcategoria_id = s.id
       WHERE p.slug = ? LIMIT 1`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('productos.obtener:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
}

// POST /api/admin/productos  (privado)
export async function crear(req, res) {
  try {
    const {
      nombre, categoria_id, subcategoria_id, descripcion_corta,
      descripcion, opciones, precio, destacado, activo,
    } = req.body;

    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const slug = slugify(nombre) + '-' + Date.now().toString(36);
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    // precio se guarda como monto FINAL plano (sin IVA). Vacío => NULL (solo cotización)
    const precioFinal = precio === '' || precio == null ? null : Number(precio);

    const [result] = await pool.query(
      `INSERT INTO productos
       (nombre, slug, categoria_id, subcategoria_id, descripcion_corta,
        descripcion, opciones, precio, imagen, destacado, activo)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [
        nombre, slug, categoria_id || null, subcategoria_id || null,
        descripcion_corta || null, descripcion || null, opciones || null,
        precioFinal, imagen, destacado ? 1 : 0, activo === '0' ? 0 : 1,
      ]
    );
    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error('productos.crear:', err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
}

// PUT /api/admin/productos/:id  (privado)
export async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      nombre, categoria_id, subcategoria_id, descripcion_corta,
      descripcion, opciones, precio, destacado, activo,
    } = req.body;

    const fields = [];
    const params = [];
    const set = (col, val) => { fields.push(`${col} = ?`); params.push(val); };

    if (nombre !== undefined) set('nombre', nombre);
    if (categoria_id !== undefined) set('categoria_id', categoria_id || null);
    if (subcategoria_id !== undefined) set('subcategoria_id', subcategoria_id || null);
    if (descripcion_corta !== undefined) set('descripcion_corta', descripcion_corta);
    if (descripcion !== undefined) set('descripcion', descripcion);
    if (opciones !== undefined) set('opciones', opciones);
    if (precio !== undefined) set('precio', precio === '' || precio == null ? null : Number(precio));
    if (destacado !== undefined) set('destacado', destacado ? 1 : 0);
    if (activo !== undefined) set('activo', activo === '0' || activo === false ? 0 : 1);
    if (req.file) set('imagen', `/uploads/${req.file.filename}`);

    if (!fields.length) return res.status(400).json({ error: 'Nada que actualizar' });

    params.push(id);
    await pool.query(`UPDATE productos SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ ok: true });
  } catch (err) {
    console.error('productos.actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
}

// DELETE /api/admin/productos/:id  (privado)
export async function eliminar(req, res) {
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('productos.eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
}
