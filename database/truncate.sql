-- =====================================================================
--  Señaliza S.A. — Vaciar (truncar) todas las tablas
--  Borra TODOS los datos pero conserva la estructura de las tablas.
--  Reinicia los AUTO_INCREMENT a 1.
--
--  Uso:  mysql -u root -p u980768685_senaliza < database/truncate.sql
-- =====================================================================
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE comprobantes;
TRUNCATE TABLE pedido_detalle;
TRUNCATE TABLE cotizaciones;
TRUNCATE TABLE pedidos;
TRUNCATE TABLE productos;
TRUNCATE TABLE subcategorias;
TRUNCATE TABLE categorias;
TRUNCATE TABLE admin_users;
TRUNCATE TABLE textos_sitio;
TRUNCATE TABLE info_contacto;

SET FOREIGN_KEY_CHECKS = 1;
