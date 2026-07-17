import path from 'path';
import pool from '../config/db.js';
import { getTransporter, esc } from '../utils/mailer.js';
import { privadoDir } from '../middleware/upload.js';
import { str, email as validarEmail, enumOr } from '../utils/sanitize.js';

// POST /api/cotizaciones (público)
export async function crear(req, res) {
  try {
    const cliente_nombre = str(req.body.cliente_nombre, 120);
    const telefono = str(req.body.telefono, 40);
    const email = validarEmail(req.body.email);
    const empresa = str(req.body.empresa, 120);
    const producto_servicio = str(req.body.producto_servicio, 200);
    const descripcion = str(req.body.descripcion, 4000);
    const detalles = str(req.body.detalles, 4000);
    const contacto_preferido = enumOr(req.body.contacto_preferido, ['whatsapp', 'correo', 'telefono'], 'whatsapp');

    if (!cliente_nombre || !telefono)
      return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });

    // Archivo del cliente (puede contener datos personales): se guarda en la
    // carpeta privada, nunca bajo /uploads público. Solo el admin lo puede ver.
    const archivo = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      `INSERT INTO cotizaciones
       (cliente_nombre, telefono, email, empresa, producto_servicio,
        descripcion, detalles, archivo, contacto_preferido)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        cliente_nombre, telefono, email || null, empresa || null,
        producto_servicio || null, descripcion || null, detalles || null,
        archivo, contacto_preferido || 'whatsapp',
      ]
    );

    // Aviso por correo al admin con los datos del cliente. Es best-effort: la
    // cotización ya quedó guardada en el panel, así que un fallo de correo (o
    // SMTP sin configurar) NO debe afectar la respuesta al cliente. Solo se
    // envía aquí, al crearse: es el único correo de la cotización.
    enviarCorreoCotizacion({
      id: result.insertId,
      cliente_nombre, telefono, email, empresa,
      producto_servicio, descripcion, detalles, contacto_preferido,
      file: req.file,
    }).catch((e) => console.error('cotizaciones.correo:', e.message));

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('cotizaciones.crear:', err);
    res.status(500).json({ error: 'Error al enviar la cotización' });
  }
}

// Envía al admin una copia por correo de la cotización recién creada.
// Si SMTP no está configurado, simplemente no hace nada (la cotización ya está
// en el panel administrativo).
async function enviarCorreoCotizacion(c) {
  const tx = getTransporter();
  if (!tx) return;

  // Correo destino: configurable por el dueño del sitio. Prioridad:
  // COTIZACION_TO > CONTACT_TO > el propio usuario SMTP.
  const destino = process.env.COTIZACION_TO || process.env.CONTACT_TO || process.env.SMTP_USER;
  const codigo = `COT-${String(c.id).padStart(5, '0')}`;

  const filas = [
    ['Nombre', c.cliente_nombre],
    ['Teléfono', c.telefono],
    ['Correo', c.email],
    ['Empresa', c.empresa],
    ['Producto / servicio', c.producto_servicio],
    ['Contacto preferido', c.contacto_preferido],
  ];

  const filasHtml = filas
    .map(
      ([k, v]) =>
        `<p style="margin:0 0 6px"><strong>${k}:</strong> ${esc(v) || '—'}</p>`
    )
    .join('');

  const bloque = (titulo, texto) =>
    texto
      ? `<p style="margin:14px 0 6px"><strong>${titulo}:</strong></p>
         <div style="background:#f8fafc;border-radius:10px;padding:14px 16px;white-space:pre-wrap">${esc(texto)}</div>`
      : '';

  const filasTexto = filas.map(([k, v]) => `${k}: ${v || '—'}`).join('\n');

  // Adjunta el archivo que subió el cliente, si lo hay.
  const attachments = c.file
    ? [{ filename: c.file.originalname || c.file.filename, path: c.file.path }]
    : [];

  await tx.sendMail({
    from: `"Cotizaciones Señaliza" <${process.env.SMTP_USER}>`,
    to: destino,
    replyTo: c.email || undefined,
    subject: `Nueva cotización ${codigo} — ${c.cliente_nombre}`,
    text:
      `Nueva cotización ${codigo}\n\n${filasTexto}\n\n` +
      `Descripción:\n${c.descripcion || '—'}\n\nDetalles:\n${c.detalles || '—'}` +
      (c.file ? `\n\n(Se adjunta el archivo enviado por el cliente)` : ''),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#111827">
        <div style="background:linear-gradient(135deg,#175190,#22d3ee);color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
          <h2 style="margin:0;font-size:18px">Nueva cotización</h2>
          <p style="margin:4px 0 0;font-size:13px;opacity:.9">${codigo}</p>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:20px 24px">
          ${filasHtml}
          ${bloque('Descripción', c.descripcion)}
          ${bloque('Detalles', c.detalles)}
          ${c.file ? `<p style="margin:16px 0 0;font-size:13px;color:#475569">📎 Se adjunta el archivo enviado por el cliente.</p>` : ''}
        </div>
      </div>`,
    attachments,
  });
}

export async function listar(_req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM cotizaciones ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('cotizaciones.listar:', err);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
}

// GET /api/admin/cotizaciones/:id/archivo (privado) — sirve el archivo real.
export async function verArchivo(req, res) {
  try {
    const [[c]] = await pool.query(
      'SELECT archivo FROM cotizaciones WHERE id = ?', [req.params.id]
    );
    if (!c || !c.archivo) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.sendFile(path.join(privadoDir, path.basename(c.archivo)), (err) => {
      if (err && !res.headersSent) res.status(404).json({ error: 'Archivo no encontrado' });
    });
  } catch (err) {
    console.error('cotizaciones.verArchivo:', err);
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
}

export async function cambiarEstado(req, res) {
  try {
    const { estado } = req.body;
    await pool.query('UPDATE cotizaciones SET estado = ? WHERE id = ?', [estado, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('cotizaciones.cambiarEstado:', err);
    res.status(500).json({ error: 'Error al actualizar la cotización' });
  }
}
