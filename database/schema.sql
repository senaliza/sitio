-- =====================================================================
--  Señaliza S.A. - Esquema de Base de Datos (MySQL)
--  IMPORTANTE: Todos los precios se almacenan como montos finales planos.
--  NO se calcula IVA en ningún punto del sistema.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS senaliza
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE senaliza;

-- ---------------------------------------------------------------------
--  Usuarios administradores
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('admin') NOT NULL DEFAULT 'admin',
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Categorías
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL UNIQUE,
  descripcion VARCHAR(300),
  orden       INT NOT NULL DEFAULT 0,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Subcategorías
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subcategorias (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  nombre       VARCHAR(120) NOT NULL,
  slug         VARCHAR(140) NOT NULL,
  activo       TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
  UNIQUE KEY uq_subcat (categoria_id, slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Productos
--  precio = monto FINAL plano (sin IVA). Es el precio exacto a pagar.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(180) NOT NULL,
  slug           VARCHAR(200) NOT NULL UNIQUE,
  categoria_id   INT,
  subcategoria_id INT,
  descripcion_corta VARCHAR(300),
  descripcion    TEXT,
  opciones       TEXT,                       -- JSON opcional con opciones disponibles
  precio         DECIMAL(12,2) DEFAULT NULL, -- monto final plano; NULL = "solo cotización"
  imagen         VARCHAR(255),
  destacado      TINYINT(1) NOT NULL DEFAULT 0,
  activo         TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id)    REFERENCES categorias(id)    ON DELETE SET NULL,
  FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE SET NULL,
  INDEX idx_prod_cat (categoria_id),
  INDEX idx_prod_activo (activo)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Pedidos
--  total = SUMA exacta de (precio_unitario * cantidad). SIN IVA.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  codigo          VARCHAR(20) NOT NULL UNIQUE,        -- ej. SEN-000123
  cliente_nombre  VARCHAR(160) NOT NULL,
  cliente_telefono VARCHAR(40) NOT NULL,
  cliente_email   VARCHAR(160),
  cliente_empresa VARCHAR(160),
  requiere_entrega     TINYINT(1) NOT NULL DEFAULT 0,
  zona_entrega         VARCHAR(20),                 -- 'gam' | 'fuera_gam'
  direccion_entrega    TEXT,
  indicaciones_entrega TEXT,
  notas           TEXT,
  metodo_pago     ENUM('sinpe','whatsapp','transferencia_bancaria') NOT NULL DEFAULT 'sinpe',
  total           DECIMAL(12,2) NOT NULL DEFAULT 0,   -- monto final exacto, sin IVA
  estado          ENUM('pendiente','en_revision','pago_pendiente',
                       'pago_recibido','confirmado','rechazado','completado')
                  NOT NULL DEFAULT 'pendiente',
  estado_pago     ENUM('pendiente','pagado','rechazado') NOT NULL DEFAULT 'pendiente',
  upload_token    VARCHAR(64),                          -- ver nota de seguridad IDOR abajo
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pedido_estado (estado)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Detalle de pedidos (snapshot del precio plano al momento del pedido)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedido_detalle (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT NOT NULL,
  producto_id     INT,
  producto_nombre VARCHAR(180) NOT NULL,   -- snapshot
  precio_unitario DECIMAL(12,2) NOT NULL,  -- monto final plano congelado
  cantidad        INT NOT NULL DEFAULT 1,
  subtotal        DECIMAL(12,2) NOT NULL,  -- precio_unitario * cantidad (sin IVA)
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Comprobantes de pago (SINPE Móvil o Transferencia bancaria)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS comprobantes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT NOT NULL,
  archivo     VARCHAR(255) NOT NULL,     -- ruta de la imagen del comprobante
  referencia  VARCHAR(120),              -- número de referencia SINPE (opcional)
  validado    TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Cotizaciones
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cotizaciones (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  cliente_nombre   VARCHAR(160) NOT NULL,
  telefono         VARCHAR(40) NOT NULL,
  email            VARCHAR(160),
  empresa          VARCHAR(160),
  producto_servicio VARCHAR(200),
  descripcion      TEXT,
  detalles         TEXT,                 -- medidas, cantidades, etc.
  archivo          VARCHAR(255),         -- imagen/archivo de referencia
  contacto_preferido ENUM('whatsapp','correo','telefono') DEFAULT 'whatsapp',
  estado           ENUM('pendiente','revisada','completada') NOT NULL DEFAULT 'pendiente',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cot_estado (estado)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Textos editables del sitio (clave -> valor)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS textos_sitio (
  clave      VARCHAR(80) PRIMARY KEY,
  valor      TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Información de contacto
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS info_contacto (
  clave VARCHAR(60) PRIMARY KEY,
  valor VARCHAR(255)
) ENGINE=InnoDB;

-- =====================================================================
--  NOTA DE MIGRACIÓN (para DBs existentes antes de agregar transferencia_bancaria)
--  Ejecuta esto manualmente una sola vez si tu tabla 'pedidos' ya existe:
--    ALTER TABLE pedidos
--      MODIFY COLUMN metodo_pago ENUM('sinpe','whatsapp','transferencia_bancaria')
--      NOT NULL DEFAULT 'sinpe';
--  Los nuevos campos de info_contacto se insertan automáticamente gracias a
--  ON DUPLICATE KEY UPDATE cuando se corre el schema o al guardar desde Admin.
-- =====================================================================

-- =====================================================================
--  NOTA DE MIGRACIÓN (para DBs existentes antes de agregar campos de dirección/entrega)
--  Ejecuta esto manualmente una sola vez si tu tabla 'pedidos' ya existe:
--    ALTER TABLE pedidos
--      ADD COLUMN requiere_entrega     TINYINT(1) NOT NULL DEFAULT 0 AFTER cliente_empresa,
--      ADD COLUMN zona_entrega         VARCHAR(20) AFTER requiere_entrega,
--      ADD COLUMN direccion_entrega    TEXT AFTER zona_entrega,
--      ADD COLUMN indicaciones_entrega TEXT AFTER direccion_entrega;
--  (zona_entrega: 'gam' para Gran Área Metropolitana, 'fuera_gam' para otras zonas)
-- =====================================================================

-- =====================================================================
--  NOTA DE LIMPIEZA (después de cambios en creación de pedidos / placeholder de codigo)
--  Si ves errores de duplicate key en 'codigo' o tienes pedidos huérfanos de intentos fallidos
--  (filas con codigo que NO empieza con 'SEN-' que quedaron por crashes, alters o placeholders
--  temporales), inspecciona y limpia con:
--    SELECT * FROM pedidos WHERE codigo NOT LIKE 'SEN-%' ORDER BY created_at DESC;
--    DELETE FROM pedidos WHERE codigo NOT LIKE 'SEN-%' AND estado = 'pendiente' AND created_at < NOW() - INTERVAL 2 DAY;
--  El código ahora usa placeholders únicos cortos por intento (ej. T9k3p2m1) para evitar
--  colisiones concurrentes en la columna UNIQUE `codigo` (VARCHAR(20)).
-- =====================================================================

-- =====================================================================
--  NOTA DE SEGURIDAD (IDOR en comprobantes — auditoría jul 2026)
--  Se encontró que POST /pedidos/:id/comprobante era público sin verificar
--  dueño (cualquiera podía leer o falsificar comprobantes de otros pedidos
--  con solo adivinar el :id, que además es secuencial). Fix:
--    1. `upload_token` (arriba): generado al crear el pedido, se devuelve
--       UNA vez en la respuesta de POST /pedidos y se exige para subir su
--       comprobante. Sin el token correcto, la subida se rechaza (403).
--    2. Los archivos de comprobantes/cotizaciones ya NO se sirven en
--       /uploads público: viven en uploads/privado/ y solo se leen vía
--       GET /admin/comprobantes/:id/archivo y
--       GET /admin/cotizaciones/:id/archivo, protegidas con JWT de admin.
--  Ejecuta esto manualmente una sola vez si tu tabla 'pedidos' ya existe:
--    ALTER TABLE pedidos ADD COLUMN upload_token VARCHAR(64) AFTER estado_pago;
-- =====================================================================

-- =====================================================================
--  DATOS INICIALES (seed)
-- =====================================================================

-- Admin por defecto.
-- IMPORTANTE: la contraseña NO se define aquí. Después de importar este schema,
-- ejecute en /server:  npm run seed:admin
-- Eso crea el usuario admin@senaliza.cr con la contraseña Admin123! usando un
-- hash bcrypt válido generado por la propia dependencia del proyecto.
-- (Cambie la contraseña en producción.)

INSERT INTO categorias (nombre, slug, descripcion, orden) VALUES
('Rótulos',        'rotulos',        'Rótulos para fachadas y negocios', 1),
('Señalización',   'senalizacion',   'Señales de seguridad e informativas', 2),
('Viniles',        'viniles',        'Viniles decorativos y publicitarios', 3),
('Personalizados', 'personalizados', 'Soluciones visuales a la medida', 4)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO subcategorias (categoria_id, nombre, slug) VALUES
(1, 'Rótulos luminosos', 'rotulos-luminosos'),
(1, 'Rótulos en alto relieve', 'rotulos-alto-relieve'),
(2, 'Señales de seguridad', 'senales-seguridad'),
(2, 'Señales informativas', 'senales-informativas'),
(3, 'Vinil de corte', 'vinil-corte'),
(3, 'Vinil impreso', 'vinil-impreso')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Productos de ejemplo (precio = monto final plano, sin IVA)
INSERT INTO productos
(nombre, slug, categoria_id, subcategoria_id, descripcion_corta, descripcion, precio, destacado, activo)
VALUES
('Rótulo alto', 'rotulo-alto', 1, 2, 'Rótulo en alto relieve de alta durabilidad',
 'Rótulo en alto relieve fabricado en materiales resistentes a la intemperie. Ideal para fachadas de negocios.',
 4000.00, 1, 1),
('Rótulo luminoso LED', 'rotulo-luminoso-led', 1, 1, 'Rótulo iluminado con LED de bajo consumo',
 'Rótulo luminoso con tecnología LED, excelente visibilidad nocturna y bajo consumo eléctrico.',
 85000.00, 1, 1),
('Señal de salida de emergencia', 'senal-salida-emergencia', 2, 3, 'Señal fotoluminiscente normada',
 'Señal de salida de emergencia fotoluminiscente, cumple con la normativa vigente de seguridad.',
 6500.00, 1, 1),
('Vinil decorativo de pared', 'vinil-decorativo-pared', 3, 5, 'Vinil de corte para decoración de interiores',
 'Vinil de corte personalizable para decoración de paredes en oficinas y comercios.',
 12000.00, 0, 1),
('Banner publicitario', 'banner-publicitario', 3, 6, 'Banner en vinil impreso full color',
 'Banner publicitario impreso a full color en vinil de alta resolución.',
 9000.00, 1, 1),
('Letrero personalizado', 'letrero-personalizado', 4, NULL, 'Diseño a la medida según su proyecto',
 'Letrero totalmente personalizado. El precio se define mediante cotización según materiales y medidas.',
 NULL, 0, 1)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

INSERT INTO textos_sitio (clave, valor) VALUES
('hero_titulo', 'Soluciones visuales que destacan su marca'),
('hero_subtitulo', 'Rótulos, señalización, viniles y productos personalizados para empresas y negocios.'),
('mision', 'Brindar soluciones de señalización y rotulación de alta calidad que ayuden a nuestros clientes a comunicar y destacar su marca.'),
('vision', 'Ser la empresa líder en soluciones visuales y señalización, reconocida por su calidad, innovación y servicio.'),
('mensaje_destacado', 'Más de una década creando soluciones visuales para empresas de todo el país.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

INSERT INTO info_contacto (clave, valor) VALUES
('telefono', '+506 8888-8888'),
('whatsapp', '50688888888'),
('email', 'info@senaliza.cr'),
('direccion', 'San José, Costa Rica'),
('sinpe_numero', '8888-8888'),
('sinpe_nombre', 'Señaliza S.A.'),
('transferencia_iban', 'CR0500000000000000000000'),
('transferencia_nombre', 'Señaliza S.A.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
