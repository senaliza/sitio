import nodemailer from 'nodemailer';

/*
 * Mailer compartido (SMTP, configurado para Hostinger por defecto).
 * Lo usan el formulario de contacto y el aviso de nuevas cotizaciones.
 *
 * Variables de entorno necesarias (.env):
 *   SMTP_HOST=smtp.hostinger.com
 *   SMTP_PORT=465
 *   SMTP_USER=tu-correo@tudominio.com
 *   SMTP_PASS=tu_contraseña
 *
 * Destinos (opcionales; si no se indican, llegan a SMTP_USER):
 *   CONTACT_TO=...      correo donde llegan los mensajes de contacto
 *   COTIZACION_TO=...   correo donde llegan las cotizaciones
 *
 * Mientras SMTP no esté configurado, getTransporter() devuelve null y cada
 * llamador decide qué hacer (el contacto responde 503; la cotización simplemente
 * omite el correo y se guarda igual en el panel).
 */

let transporter = null;

export function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // Hostinger: 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

// Escapa texto para insertarlo de forma segura en el HTML del correo.
export const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
