import pool from '../config/db.js';

// GET /api/contenido (público) — textos + info de contacto
export async function obtener(_req, res) {
  try {
    const [textos] = await pool.query('SELECT clave, valor FROM textos_sitio');
    const [contacto] = await pool.query('SELECT clave, valor FROM info_contacto');
    const toObj = (rows) => Object.fromEntries(rows.map((r) => [r.clave, r.valor]));
    res.json({ textos: toObj(textos), contacto: toObj(contacto) });
  } catch (err) {
    console.error('contenido.obtener:', err);
    res.status(500).json({ error: 'Error al obtener el contenido' });
  }
}

// PUT /api/admin/contenido (privado)
export async function actualizar(req, res) {
  try {
    const { textos = {}, contacto = {} } = req.body;
    for (const [clave, valor] of Object.entries(textos)) {
      await pool.query(
        `INSERT INTO textos_sitio (clave, valor) VALUES (?,?)
         ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
        [clave, valor]
      );
    }
    for (const [clave, valor] of Object.entries(contacto)) {
      await pool.query(
        `INSERT INTO info_contacto (clave, valor) VALUES (?,?)
         ON DUPLICATE KEY UPDATE valor = VALUES(valor)`,
        [clave, valor]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('contenido.actualizar:', err);
    res.status(500).json({ error: 'Error al actualizar el contenido' });
  }
}
