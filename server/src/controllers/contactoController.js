import { getTransporter, esc } from '../utils/mailer.js';
import { str, email as validarEmail } from '../utils/sanitize.js';

/*
 * Formulario de contacto del sitio público.
 * Envía el mensaje por correo usando el mailer SMTP compartido (utils/mailer.js).
 * Mientras SMTP no esté configurado, el endpoint responde 503 con un mensaje
 * claro (no rompe el resto del sitio).
 */

// POST /api/contacto (público)
export async function enviar(req, res) {
  try {
    const body = req.body || {};
    const nombre = str(body.nombre, 120);
    const email = validarEmail(body.email);
    const telefono = str(body.telefono, 40) || '';
    const asunto = str(body.asunto, 150) || '';
    const mensaje = str(body.mensaje, 4000);

    if (!nombre || !body.email || !mensaje)
      return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' });

    if (!email)
      return res.status(400).json({ error: 'El correo electrónico no es válido.' });

    const tx = getTransporter();
    if (!tx)
      return res.status(503).json({
        error: 'El servicio de correo aún no está configurado. Intente por WhatsApp mientras tanto.',
      });

    const destino = process.env.CONTACT_TO || process.env.SMTP_USER;
    const titulo = asunto.trim() ? `Contacto web — ${asunto.trim()}` : 'Nuevo mensaje desde el sitio web';

    await tx.sendMail({
      from: `"Sitio web Señaliza" <${process.env.SMTP_USER}>`,
      to: destino,
      replyTo: email,
      subject: titulo,
      text:
        `Nombre: ${nombre}\nCorreo: ${email}\nTeléfono: ${telefono || '—'}\n` +
        `Asunto: ${asunto || '—'}\n\nMensaje:\n${mensaje}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111827">
          <div style="background:linear-gradient(135deg,#175190,#22d3ee);color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
            <h2 style="margin:0;font-size:18px">Nuevo mensaje de contacto</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:20px 24px">
            <p style="margin:0 0 6px"><strong>Nombre:</strong> ${esc(nombre)}</p>
            <p style="margin:0 0 6px"><strong>Correo:</strong> ${esc(email)}</p>
            <p style="margin:0 0 6px"><strong>Teléfono:</strong> ${esc(telefono) || '—'}</p>
            <p style="margin:0 0 14px"><strong>Asunto:</strong> ${esc(asunto) || '—'}</p>
            <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;white-space:pre-wrap">${esc(mensaje)}</div>
          </div>
        </div>`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('contacto.enviar:', err);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Inténtelo de nuevo más tarde.' });
  }
}
