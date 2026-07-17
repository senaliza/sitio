// =====================================================================
//  Exporta los datos ACTUALES de la base conectada al sitio a un archivo
//  SQL de INSERTs: database/datos-actuales.sql
//
//  Uso:  node server/src/scripts/dump-data.js
// =====================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../../../database/datos-actuales.sql');

// Orden respetando llaves foráneas (padres primero)
const TABLES = [
  'admin_users',
  'categorias',
  'subcategorias',
  'productos',
  'pedidos',
  'pedido_detalle',
  'comprobantes',
  'cotizaciones',
  'textos_sitio',
  'info_contacto',
];

function sqlValue(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Date) {
    return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
  }
  if (Buffer.isBuffer(v)) {
    return `0x${v.toString('hex')}`;
  }
  // String: escapar comillas y backslashes
  const s = String(v)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `'${s}'`;
}

async function main() {
  const lines = [];
  lines.push('-- =====================================================================');
  lines.push('--  Señaliza S.A. — Datos actuales exportados de la base conectada');
  lines.push(`--  Generado: ${new Date().toISOString()}`);
  lines.push('--  Uso: correr DESPUÉS de truncar (database/truncate.sql)');
  lines.push('-- =====================================================================');
  lines.push('SET FOREIGN_KEY_CHECKS = 0;');
  lines.push('');

  for (const table of TABLES) {
    const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
    lines.push(`-- ── ${table} (${rows.length} filas) ─────────────────────────────`);
    if (rows.length === 0) {
      lines.push('');
      continue;
    }
    const cols = Object.keys(rows[0]);
    const colList = cols.map((c) => `\`${c}\``).join(', ');
    for (const row of rows) {
      const vals = cols.map((c) => sqlValue(row[c])).join(', ');
      lines.push(`INSERT INTO \`${table}\` (${colList}) VALUES (${vals});`);
    }
    lines.push('');
  }

  lines.push('SET FOREIGN_KEY_CHECKS = 1;');
  lines.push('');

  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
  console.log(`✔ Datos exportados a ${OUT}`);
  await pool.end();
}

main().catch((err) => {
  console.error('�‑ Error exportando datos:', err);
  process.exit(1);
});
