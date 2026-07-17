import pool from '../config/db.js';
import { slugify } from '../utils/helpers.js';

// GET /api/categorias (público) — incluye subcategorías
export async function listar(_req, res) {
  try {
    const [cats] = await pool.query(
      'SELECT * FROM categorias WHERE activo = 1 ORDER BY orden, nombre'
    );
    const [subs] = await pool.query(
      'SELECT * FROM subcategorias WHERE activo = 1 ORDER BY nombre'
    );
    const data = cats.map((c) => ({
      ...c,
      subcategorias: subs.filter((s) => s.categoria_id === c.id),
    }));
    res.json(data);
  } catch (err) {
    console.error('categorias.listar:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
}

export async function crear(req, res) {
  try {
    const { nombre, descripcion, orden } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    const slug = slugify(nombre);
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES (?,?,?,?)',
      [nombre, slug, descripcion || null, orden || 0]
    );
    res.status(201).json({ id: result.insertId, slug });
  } catch (err) {
    console.error('categorias.crear:', err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
}

export async function actualizar(req, res) {
  try {
    const { nombre, descripcion, orden, activo } = req.body;
    await pool.query(
      'UPDATE categorias SET nombre=?, descripcion=?, orden=?, activo=? WHERE id=?',
      [nombre, descripcion || null, orden || 0, activo === false ? 0 : 1, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('categorias.actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
}

export async function eliminar(req, res) {
  try {
    await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('categorias.eliminar:', err);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
}

export async function crearSub(req, res) {
  try {
    const { categoria_id, nombre } = req.body;
    if (!categoria_id || !nombre)
      return res.status(400).json({ error: 'Categoría y nombre son obligatorios' });
    const slug = slugify(nombre);
    const [result] = await pool.query(
      'INSERT INTO subcategorias (categoria_id, nombre, slug) VALUES (?,?,?)',
      [categoria_id, nombre, slug]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('subcategorias.crear:', err);
    res.status(500).json({ error: 'Error al crear la subcategoría' });
  }
}
