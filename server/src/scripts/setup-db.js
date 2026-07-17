import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

// =====================================================================
//  Instalador completo de la base de datos de Señaliza S.A.
//  En UN solo comando:
//    1. Crea la base `senaliza` y todas sus tablas (importa schema.sql).
//    2. Carga los datos iniciales (categorías, productos, textos, contacto).
//    3. Crea el usuario administrador del cliente con contraseña hasheada.
//
//  Uso:
//    npm run setup:db
//
//  Las credenciales del admin y de MySQL salen del archivo .env.
//  Puede sobreescribir el admin con variables al vuelo:
//    SEED_ADMIN_EMAIL=otro@correo.com SEED_ADMIN_PASSWORD=Clave123 npm run setup:db
// =====================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(__dirname, '../../../database/schema.sql');

// Credenciales del administrador del cliente (valores por defecto).
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'info@contecr.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Senaliza2026';
const ADMIN_NOMBRE = process.env.SEED_ADMIN_NOMBRE || 'Administrador';

async function run() {
  const DB_NAME = process.env.DB_NAME || 'senaliza';
  console.log('→ Conectando a MySQL...');

  // Conexión DIRECTA a la base ya existente (DB_NAME). En hostings compartidos
  // (ej. Hostinger) el usuario NO tiene permiso para CREATE DATABASE y la base
  // ya viene creada con un nombre fijo, así que se omiten esas sentencias del
  // schema. multipleStatements permite correr el resto del archivo de una vez.
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  console.log(`→ Importando estructura y datos iniciales en "${DB_NAME}"...`);
  let schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  // Quitar las sentencias que el hosting compartido no permite o no necesita:
  // CREATE DATABASE ...;  y  USE senaliza;  (ya estamos dentro de DB_NAME).
  schemaSql = schemaSql
    .replace(/CREATE\s+DATABASE[\s\S]*?;/i, '')
    .replace(/USE\s+\w+\s*;/i, '');
  await connection.query(schemaSql);
  console.log('  ✓ Tablas y datos de ejemplo creados.');

  console.log(`→ Creando usuario administrador (${ADMIN_EMAIL})...`);
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await connection.query(
    `INSERT INTO admin_users (nombre, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), nombre = VALUES(nombre)`,
    [ADMIN_NOMBRE, ADMIN_EMAIL, hash]
  );
  console.log('  ✓ Administrador listo.');

  await connection.end();

  console.log('\n=====================================================');
  console.log('  ✅ Base de datos instalada y lista para el cliente');
  console.log('=====================================================');
  console.log(`  Correo:     ${ADMIN_EMAIL}`);
  console.log(`  Contraseña: ${ADMIN_PASSWORD}`);
  console.log('  Acceso:     /admin/login');
  console.log('  ⚠ Recomiende al cliente cambiar la contraseña en producción.');
  console.log('=====================================================\n');
  process.exit(0);
}

run().catch((err) => {
  console.error('\n✗ Error durante la instalación de la base de datos:');
  console.error(err.message || err);
  console.error('\nRevise que MySQL esté corriendo y que las credenciales DB_* del .env sean correctas.');
  process.exit(1);
});
