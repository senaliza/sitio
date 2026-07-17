# Señaliza S.A. — Plataforma web

Plataforma corporativa + comercio para una empresa de rótulos, señalización, viniles y productos personalizados. Incluye sitio público (catálogo, carrito, pedidos, cotizaciones, pago por SINPE Móvil, Transferencia bancaria y WhatsApp) y un dashboard administrativo protegido con JWT.

**Stack:** React + Vite (frontend) · Node.js + Express (backend) · MySQL (base de datos).

> **Precios sin IVA.** Todos los montos se manejan como precios planos finales. El precio del catálogo es el mismo del detalle, del carrito y del checkout. El total es exactamente la suma de `precio × cantidad`; no se agrega ninguna línea de impuestos en ninguna parte del sistema.

---

## Estructura

```
senaliza-project/
├── client/      # Frontend React (Vite)
├── server/      # API REST Express
└── database/
    └── schema.sql
```

## Requisitos

- Node.js 18 o superior
- MySQL 8 o superior

---

## 1. Base de datos

```bash
mysql -u root -p < database/schema.sql
```

Esto crea la base `senaliza` con sus tablas y datos de ejemplo (categorías, subcategorías, productos, textos e información de contacto).

## 2. Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env       # edite credenciales de MySQL y JWT_SECRET
npm run seed:admin         # crea el usuario administrador con contraseña válida
npm run dev                # arranca en http://localhost:4000
```

**Credenciales del administrador** (creadas por `seed:admin`):

- Correo: `admin@senaliza.cr`
- Contraseña: `Admin123!`

Puede cambiarlas con las variables `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` antes de ejecutar el seed. **Cambie la contraseña en producción.**

Variables de entorno (`.env`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del API (4000 por defecto) |
| `CLIENT_URL` | Origen permitido por CORS (ej. `http://localhost:5173`) |
| `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Conexión MySQL |
| `JWT_SECRET` | Clave para firmar los tokens |
| `JWT_EXPIRES` | Vigencia del token (ej. `8h`) |

## 3. Frontend (`/client`)

```bash
cd client
npm install
cp .env.example .env       # VITE_API_URL=/api (usa el proxy de Vite)
npm run dev                # arranca en http://localhost:5173
```

El servidor de desarrollo de Vite redirige `/api` y `/uploads` hacia `http://localhost:4000`, así que ambos procesos deben estar corriendo.

---

## Rutas principales

**Público**

- `/` Inicio
- `/nosotros`
- `/catalogo` — búsqueda y filtro por categoría
- `/producto/:slug` — detalle, agregar al carrito, cotizar, WhatsApp
- `/cotizar` — formulario de cotización con adjunto
- `/carrito` y `/checkout` — pedido + comprobante (SINPE Móvil o Transferencia bancaria)
- `/contacto`

**Administración** (requiere iniciar sesión)

- `/admin/login`
- `/admin` — resumen
- `/admin/productos` — CRUD + imágenes + activar/desactivar
- `/admin/categorias` — categorías y subcategorías
- `/admin/pedidos` — ver pedidos, cambiar estado, validar comprobantes (SINPE/transferencia), marcar pago
- `/admin/cotizaciones` — revisar y cambiar estado
- `/admin/contenido` — editar textos del sitio e información de contacto

## Notas de diseño

- Los pedidos **no se confirman automáticamente**: el cliente envía el comprobante (SINPE o transferencia bancaria) y queda en revisión; el administrador valida el pago desde el dashboard.
- El total se **recalcula en el servidor** a partir de los precios planos de la base de datos; los precios enviados por el cliente se ignoran. Los productos sin precio (solo cotización) se omiten del total.
- Paleta: blanco principal, azul oscuro corporativo, toques rojos discretos. Íconos SVG propios (sin emojis).

## Imágenes de productos (y despliegue en Hostinger)

### Cómo funciona

1. En `/admin/productos`, al crear o **editar** un producto se puede subir su imagen. Al editar, el modal muestra la **imagen actual** y permite **reemplazarla** subiendo otra (si no sube ninguna, se conserva la que tenía).
2. El backend guarda el archivo en la carpeta **`server/uploads/`** con un nombre único (`<timestamp>-<aleatorio>.<ext>`) y registra en la base de datos solo la ruta `\/uploads\/<archivo>`.
3. El API expone esa carpeta como estática en `\/uploads`, así que la imagen queda disponible en `https://<dominio-del-api>/uploads/<archivo>`.
4. El frontend arma la URL final con `urlImagen()` según `VITE_API_URL` (ver abajo).

**Límites:** máximo **8 MB** por archivo. Formatos permitidos: `jpg`, `jpeg`, `png`, `webp`, `gif` (y `pdf` para comprobantes/adjuntos).

> Las imágenes del **carrusel vertical** de la página de inicio son ilustraciones SVG de marca (no usan esta carpeta). Para cambiarlas por fotos reales, edite `client/src/components/CarruselVertical.jsx` y agregue `img: '/ruta-de-la-foto.jpg'` a cada slide.

### En Hostinger

La clave es que la carpeta `server/uploads/` **persista y sea escribible**, y que el frontend apunte al dominio correcto del API.

1. **La carpeta `uploads/` vive en el disco del servidor.** Está en `.gitignore` (solo se versiona `.gitkeep`), así que **no se borra con cada deploy** siempre que no elimine esa carpeta. Si despliega con Git, verifique que la carpeta exista en el servidor y tenga permisos de escritura para el proceso de Node.
2. **No guarde `uploads/` dentro de `client/dist`** ni de ninguna carpeta que se regenere en cada build: se perdería al reconstruir.
3. **Dominio del API y de las imágenes** — configure `VITE_API_URL` en `client/.env` antes de `npm run build`:
   - **Mismo dominio** (frontend y API detrás del mismo dominio/proxy): use `VITE_API_URL=/api`. Las imágenes se sirven con ruta relativa `\/uploads\/...` y todo funciona.
   - **API en subdominio aparte** (ej. `api.tudominio.com`): use `VITE_API_URL=https://api.tudominio.com/api`. `urlImagen()` antepone automáticamente `https://api.tudominio.com`, de modo que las imágenes cargan desde el API.
4. **CORS:** ajuste `CLIENT_URL` en `server/.env` al dominio del frontend.
5. **Respaldo:** la carpeta `uploads/` es contenido del cliente; inclúyala en sus copias de seguridad.

## Producción (resumen)

1. `cd client && npm run build` genera `client/dist` (con el `VITE_API_URL` correcto según el punto anterior).
2. Sirva `client/dist` con su servidor estático preferido o desde Express.
3. Configure `CLIENT_URL`, credenciales de MySQL y un `JWT_SECRET` robusto.
4. Asegure que `server/uploads/` exista, persista y sea escribible.
