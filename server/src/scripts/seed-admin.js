import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

// Crea (o actualiza) el usuario administrador por defecto con una contraseña
// hasheada correctamente. Ejecutar una vez tras importar el schema:
//   npm run seed:admin
const EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@senaliza.cr';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
const NOMBRE = 'Administrador';

async function run() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  await pool.query(
    `INSERT INTO admin_users (nombre, email, password_hash)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), nombre = VALUES(nombre)`,
    [NOMBRE, EMAIL, hash]
  );
  console.log(`✓ Admin listo: ${EMAIL}  (contraseña: ${PASSWORD})`);
  await pool.end();
  process.exit(0);
}

run().catch((err) => {
  console.error('Error al crear el admin:', err);
  process.exit(1);
});
