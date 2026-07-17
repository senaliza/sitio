-- =====================================================================
--  Señaliza S.A. — Carga de productos reales
--  Uso: mysql -u root -p senaliza < database/productos-seed.sql
--
--  Qué hace este script:
--    1. Elimina los productos de ejemplo del schema inicial.
--    2. Reemplaza las subcategorías de Señalización con las tres
--       familias reales de producto.
--    3. Inserta los 35 productos reales bajo Señalización.
--
--  Es seguro correrlo más de una vez (ON DUPLICATE KEY UPDATE).
-- =====================================================================

-- ── 1. Limpiar productos de ejemplo ──────────────────────────────────
DELETE FROM productos WHERE slug IN (
  'rotulo-alto',
  'rotulo-luminoso-led',
  'senal-salida-emergencia',
  'vinil-decorativo-pared',
  'banner-publicitario',
  'letrero-personalizado'
);

-- ── 2. Subcategorías de Señalización ─────────────────────────────────
-- Elimina las genéricas del schema y las reemplaza por las tres
-- familias reales (ON DELETE SET NULL en productos, sin riesgo).
DELETE FROM subcategorias WHERE slug IN ('senales-seguridad', 'senales-informativas');

INSERT INTO subcategorias (categoria_id, nombre, slug) VALUES
  (2, 'Fotoluminiscentes',   'fotoluminiscentes'),
  (2, 'Laminadas',           'laminadas'),
  (2, 'Exteriores PVC 5mm',  'exteriores-pvc-5mm')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Variables para no hardcodear IDs
SET @cat  = (SELECT id FROM categorias    WHERE slug = 'senalizacion');
SET @foto = (SELECT id FROM subcategorias WHERE slug = 'fotoluminiscentes');
SET @lam  = (SELECT id FROM subcategorias WHERE slug = 'laminadas');
SET @ext  = (SELECT id FROM subcategorias WHERE slug = 'exteriores-pvc-5mm');

-- ── 3. Productos reales ───────────────────────────────────────────────
INSERT INTO productos
  (nombre, slug, categoria_id, subcategoria_id,
   descripcion_corta, descripcion, opciones,
   precio, imagen, destacado, activo)
VALUES

-- ════════════════════════════════════════════════════════════════════
--  PVC 3mm · Fotoluminiscente + vinil de corte
--  (11 productos · señales de evacuación y emergencia)
-- ════════════════════════════════════════════════════════════════════

('Salida 10×33 cm',
 'salida-10x33cm', @cat, @foto,
 'Señal de salida fotoluminiscente 10×33 cm',
 'Señal de salida fabricada en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Se carga con la luz ambiente y brilla en la oscuridad sin necesidad de electricidad. '
 'Medidas: 10×33 cm. Ideal para pasillos y puertas de menor tamaño.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"10×33 cm"}',
 4500.00, NULL, 0, 1),

('Salida 20×66 cm',
 'salida-20x66cm', @cat, @foto,
 'Señal de salida fotoluminiscente 20×66 cm',
 'Señal de salida fabricada en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Versión de mayor tamaño para espacios amplios y mayor visibilidad. '
 'Medidas: 20×66 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"20×66 cm"}',
 13500.00, NULL, 0, 1),

('Salida de Emergencia 17.5×56 cm',
 'salida-emergencia-175x56cm', @cat, @foto,
 'Señal de salida de emergencia fotoluminiscente 17.5×56 cm',
 'Señal de salida de emergencia en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Cumple con las normas de señalización de emergencia vigentes en Costa Rica. '
 'Medidas: 17.5×56 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.5×56 cm"}',
 10500.00, NULL, 1, 1),

('Ruta de Evacuación Derecha 17.5×35 cm',
 'ruta-evacuacion-derecha-175x35cm', @cat, @foto,
 'Señal de ruta de evacuación flecha derecha 17.5×35 cm',
 'Señal de ruta de evacuación con flecha hacia la derecha, fabricada en PVC 3 mm '
 'con fotoluminiscente y vinil de corte. Orientación visual clara en situaciones de emergencia. '
 'Medidas: 17.5×35 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.5×35 cm","direccion":"derecha"}',
 7500.00, NULL, 0, 1),

('Ruta de Evacuación Izquierda 17.5×35 cm',
 'ruta-evacuacion-izquierda-175x35cm', @cat, @foto,
 'Señal de ruta de evacuación flecha izquierda 17.5×35 cm',
 'Señal de ruta de evacuación con flecha hacia la izquierda, fabricada en PVC 3 mm '
 'con fotoluminiscente y vinil de corte. Complementa el recorrido de evacuación junto '
 'a la versión derecha. Medidas: 17.5×35 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.5×35 cm","direccion":"izquierda"}',
 7500.00, NULL, 0, 1),

('Flecha 17.5×17.5 cm',
 'flecha-175x175cm', @cat, @foto,
 'Señal de flecha fotoluminiscente 17.5×17.5 cm',
 'Flecha de evacuación en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Útil para reforzar la orientación en corredores y escaleras. '
 'Medidas: 17.5×17.5 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.5×17.5 cm"}',
 3000.00, NULL, 0, 1),

('Extintor 17.4×22.4 cm',
 'extintor-foto-174x224cm', @cat, @foto,
 'Señal de extintor fotoluminiscente 17.4×22.4 cm',
 'Señal indicadora de extintor fabricada en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Visible en condiciones de baja luz o corte de energía. Medidas: 17.4×22.4 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.4×22.4 cm"}',
 3500.00, NULL, 0, 1),

('Extintor 22.4×27.4 cm',
 'extintor-foto-224x274cm', @cat, @foto,
 'Señal de extintor fotoluminiscente 22.4×27.4 cm',
 'Señal indicadora de extintor en formato mayor, fabricada en PVC 3 mm con fotoluminiscente '
 'y vinil de corte. Mayor visibilidad en espacios abiertos. Medidas: 22.4×27.4 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"22.4×27.4 cm"}',
 4900.00, NULL, 0, 1),

('Alarma 17.4×22.4 cm',
 'alarma-foto-174x224cm', @cat, @foto,
 'Señal de alarma fotoluminiscente 17.4×22.4 cm',
 'Señal indicadora de alarma de emergencia en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Facilita la localización del punto de alarma en situaciones de emergencia. '
 'Medidas: 17.4×22.4 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"17.4×22.4 cm"}',
 3500.00, NULL, 0, 1),

('Botiquín 22.4×27.4 cm',
 'botiquin-foto-224x274cm', @cat, @foto,
 'Señal de botiquín fotoluminiscente 22.4×27.4 cm',
 'Señal indicadora de botiquín de primeros auxilios en PVC 3 mm con fotoluminiscente '
 'y vinil de corte. Localización rápida del botiquín en emergencias. '
 'Medidas: 22.4×27.4 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"22.4×27.4 cm"}',
 4900.00, NULL, 0, 1),

('Primeros Auxilios 22.4×27.4 cm',
 'primeros-auxilios-foto-224x274cm', @cat, @foto,
 'Señal de primeros auxilios fotoluminiscente 22.4×27.4 cm',
 'Señal de primeros auxilios en PVC 3 mm con fotoluminiscente y vinil de corte. '
 'Indica la ubicación del área o equipo de primeros auxilios. '
 'Medidas: 22.4×27.4 cm.',
 '{"material":"PVC 3mm","acabado":"fotoluminiscente + vinil de corte","medidas":"22.4×27.4 cm"}',
 4900.00, NULL, 0, 1),

-- ════════════════════════════════════════════════════════════════════
--  PVC 3mm · Impresión laminada full color
--  (22 productos · señales de seguridad, informativas y normativas)
-- ════════════════════════════════════════════════════════════════════

('Tipo de Extintor 20×30 cm',
 'tipo-extintor-20x30cm', @cat, @lam,
 'Señal tipo de extintor laminada full color 20×30 cm',
 'Señal informativa del tipo de extintor en PVC 3 mm con impresión laminada full color. '
 'Resistente a la humedad y al roce. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm"}',
 3000.00, NULL, 0, 1),

('Tipo de Extintor 30×40 cm',
 'tipo-extintor-30x40cm', @cat, @lam,
 'Señal tipo de extintor laminada full color 30×40 cm',
 'Señal informativa del tipo de extintor en formato grande, en PVC 3 mm con impresión '
 'laminada full color. Mayor visibilidad para espacios amplios. Medidas: 30×40 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"30×40 cm"}',
 4500.00, NULL, 0, 1),

('Riesgo Eléctrico 12.4×17.4 cm',
 'riesgo-electrico-124x174cm', @cat, @lam,
 'Señal de riesgo eléctrico laminada 12.4×17.4 cm',
 'Señal de advertencia de riesgo eléctrico en PVC 3 mm con impresión laminada full color. '
 'Para tableros, subestaciones y equipos eléctricos. Medidas: 12.4×17.4 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"12.4×17.4 cm"}',
 1500.00, NULL, 0, 1),

('Riesgo de Atrapamiento 12.4×17.4 cm',
 'riesgo-atrapamiento-124x174cm', @cat, @lam,
 'Señal de riesgo de atrapamiento laminada 12.4×17.4 cm',
 'Señal de advertencia de riesgo de atrapamiento en PVC 3 mm con impresión laminada full color. '
 'Para maquinaria industrial y equipos con partes móviles. Medidas: 12.4×17.4 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"12.4×17.4 cm"}',
 1500.00, NULL, 0, 1),

('Riesgo de Incendio 12.4×17.4 cm',
 'riesgo-incendio-124x174cm', @cat, @lam,
 'Señal de riesgo de incendio laminada 12.4×17.4 cm',
 'Señal de advertencia de riesgo de incendio en PVC 3 mm con impresión laminada full color. '
 'Para áreas con materiales inflamables o fuentes de calor. Medidas: 12.4×17.4 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"12.4×17.4 cm"}',
 1500.00, NULL, 0, 1),

('Peligro Alto Voltaje 20×30 cm',
 'peligro-alto-voltaje-20x30cm', @cat, @lam,
 'Señal de peligro alto voltaje laminada 20×30 cm',
 'Señal de peligro alto voltaje en PVC 3 mm con impresión laminada full color. '
 'Para transformadores, tableros de alta tensión y zonas restringidas. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm"}',
 3000.00, NULL, 0, 1),

('Ley de Vapeo y Fumado 20×15 cm — Servicios Sanitarios',
 'ley-vapeo-fumado-sanitarios-20x15cm', @cat, @lam,
 'Señal ley de vapeo y fumado 20×15 cm para servicios sanitarios',
 'Señal de ley de vapeo y fumado en PVC 3 mm con impresión laminada full color. '
 'Diseñada para colocarse en servicios sanitarios. Cumple con la normativa costarricense. '
 'Medidas: 20×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×15 cm","uso":"servicios sanitarios"}',
 1500.00, NULL, 0, 1),

('Ley de Vapeo y Fumado 30×40 cm — Áreas Comunes',
 'ley-vapeo-fumado-comunes-30x40cm', @cat, @lam,
 'Señal ley de vapeo y fumado 30×40 cm para áreas comunes',
 'Señal de ley de vapeo y fumado en PVC 3 mm con impresión laminada full color. '
 'Para áreas comunes como lobbies, salas de espera y comedores. '
 'Medidas: 30×40 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"30×40 cm","uso":"áreas comunes"}',
 4500.00, NULL, 0, 1),

('Ley de Vapeo y Fumado 60×90 cm — Parqueo (PVC 3mm)',
 'ley-vapeo-fumado-parqueo-3mm-60x90cm', @cat, @lam,
 'Señal ley de vapeo y fumado 60×90 cm para parqueo en PVC 3mm',
 'Señal de ley de vapeo y fumado en gran formato, en PVC 3 mm con impresión laminada full color. '
 'Para instalarse en parqueos y accesos vehiculares. Medidas: 60×90 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"60×90 cm","uso":"parqueo"}',
 14500.00, NULL, 0, 1),

('Ley de Acoso 20×30 cm',
 'ley-acoso-20x30cm', @cat, @lam,
 'Señal ley de acoso laminada full color 20×30 cm',
 'Señal informativa sobre la ley de acoso laboral y sexual en PVC 3 mm con impresión '
 'laminada full color. Obligatoria en centros de trabajo según la normativa vigente. '
 'Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm"}',
 3000.00, NULL, 0, 1),

('LPG 30×40 cm',
 'lpg-30x40cm', @cat, @lam,
 'Señal de gas LPG laminada full color 30×40 cm',
 'Señal de gas licuado de petróleo (LPG) en PVC 3 mm con impresión laminada full color. '
 'Para cocinas industriales, cuartos de gas y áreas de almacenamiento. Medidas: 30×40 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"30×40 cm"}',
 4500.00, NULL, 0, 1),

('Servicios Sanitarios Hombres 20×15 cm',
 'sanitarios-hombres-20x15cm', @cat, @lam,
 'Señal servicios sanitarios hombres 20×15 cm',
 'Señal de servicios sanitarios para hombres en PVC 3 mm con impresión laminada full color. '
 'Diseño claro y moderno. Medidas: 20×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×15 cm","genero":"hombres"}',
 1500.00, NULL, 0, 1),

('Servicios Sanitarios Mujeres 20×15 cm',
 'sanitarios-mujeres-20x15cm', @cat, @lam,
 'Señal servicios sanitarios mujeres 20×15 cm',
 'Señal de servicios sanitarios para mujeres en PVC 3 mm con impresión laminada full color. '
 'Diseño claro y moderno. Medidas: 20×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×15 cm","genero":"mujeres"}',
 1500.00, NULL, 0, 1),

('Servicios Sanitarios Mixto 25×15 cm',
 'sanitarios-mixto-25x15cm', @cat, @lam,
 'Señal servicios sanitarios mixto 25×15 cm',
 'Señal de servicios sanitarios mixto (hombres y mujeres) en PVC 3 mm con impresión '
 'laminada full color. Para espacios con un solo módulo sanitario. Medidas: 25×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"25×15 cm","genero":"mixto"}',
 2000.00, NULL, 0, 1),

('Servicios Sanitarios Mixto Ley 7600 — 30×15 cm',
 'sanitarios-mixto-ley7600-30x15cm', @cat, @lam,
 'Señal servicios sanitarios mixto con símbolo Ley 7600 — 30×15 cm',
 'Señal de servicios sanitarios mixto con símbolo de accesibilidad (Ley 7600) en PVC 3 mm '
 'con impresión laminada full color. Para instalaciones accesibles a personas con discapacidad. '
 'Medidas: 30×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"30×15 cm","genero":"mixto","ley7600":true}',
 2500.00, NULL, 0, 1),

('Símbolo Ley 7600 — 15×15 cm',
 'simbolo-ley7600-15x15cm', @cat, @lam,
 'Símbolo de accesibilidad Ley 7600 laminado 15×15 cm',
 'Símbolo internacional de accesibilidad (Ley 7600) en PVC 3 mm con impresión laminada full color. '
 'Para estacionamientos, rampas, baños y entradas accesibles. Medidas: 15×15 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"15×15 cm"}',
 1000.00, NULL, 0, 1),

('Residuos Orgánicos 20×30 cm',
 'residuos-organicos-20x30cm', @cat, @lam,
 'Señal residuos orgánicos laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos orgánicos en PVC 3 mm con impresión '
 'laminada full color. Contribuye a la correcta separación de residuos. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"orgánicos"}',
 3000.00, NULL, 0, 1),

('Residuos Plásticos 20×30 cm',
 'residuos-plasticos-20x30cm', @cat, @lam,
 'Señal residuos plásticos laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos plásticos en PVC 3 mm con impresión '
 'laminada full color. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"plásticos"}',
 3000.00, NULL, 0, 1),

('Residuos Vidrio 20×30 cm',
 'residuos-vidrio-20x30cm', @cat, @lam,
 'Señal residuos vidrio laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos de vidrio en PVC 3 mm con impresión '
 'laminada full color. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"vidrio"}',
 3000.00, NULL, 0, 1),

('Residuos Ordinarios 20×30 cm',
 'residuos-ordinarios-20x30cm', @cat, @lam,
 'Señal residuos ordinarios laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos ordinarios (no reciclables) en PVC 3 mm '
 'con impresión laminada full color. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"ordinarios"}',
 3000.00, NULL, 0, 1),

('Residuos Papel y Cartón 20×30 cm',
 'residuos-papel-carton-20x30cm', @cat, @lam,
 'Señal residuos papel y cartón laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos de papel y cartón en PVC 3 mm con impresión '
 'laminada full color. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"papel y cartón"}',
 3000.00, NULL, 0, 1),

('Residuos Metal y Aluminio 20×30 cm',
 'residuos-metal-aluminio-20x30cm', @cat, @lam,
 'Señal residuos metal y aluminio laminada 20×30 cm',
 'Señal identificadora de contenedor de residuos de metal y aluminio en PVC 3 mm con impresión '
 'laminada full color. Medidas: 20×30 cm.',
 '{"material":"PVC 3mm","acabado":"impresión laminada full color","medidas":"20×30 cm","residuo":"metal y aluminio"}',
 3000.00, NULL, 0, 1),

-- ════════════════════════════════════════════════════════════════════
--  PVC 5mm · Impresión laminada full color
--  (2 productos · señales de exterior y mayor resistencia)
-- ════════════════════════════════════════════════════════════════════

('Ley de Vapeo y Fumado 60×90 cm — Parqueo (PVC 5mm)',
 'ley-vapeo-fumado-parqueo-5mm-60x90cm', @cat, @ext,
 'Señal ley de vapeo y fumado 60×90 cm para parqueo en PVC 5mm',
 'Señal de ley de vapeo y fumado en gran formato sobre PVC 5 mm, mayor rigidez y resistencia '
 'para exteriores. Con impresión laminada full color. Para parqueos descubiertos o expuestos '
 'a la intemperie. Medidas: 60×90 cm.',
 '{"material":"PVC 5mm","acabado":"impresión laminada full color","medidas":"60×90 cm","uso":"parqueo exterior"}',
 18500.00, NULL, 1, 1),

('Punto de Reunión 45×65 cm',
 'punto-reunion-45x65cm', @cat, @ext,
 'Señal punto de reunión laminada full color 45×65 cm en PVC 5mm',
 'Señal de punto de reunión en PVC 5 mm con impresión laminada full color. '
 'Alta resistencia para exteriores. Indicación clara del punto de encuentro en casos de evacuación. '
 'Medidas: 45×65 cm.',
 '{"material":"PVC 5mm","acabado":"impresión laminada full color","medidas":"45×65 cm"}',
 14500.00, NULL, 1, 1)

ON DUPLICATE KEY UPDATE
  nombre            = VALUES(nombre),
  categoria_id      = VALUES(categoria_id),
  subcategoria_id   = VALUES(subcategoria_id),
  descripcion_corta = VALUES(descripcion_corta),
  descripcion       = VALUES(descripcion),
  opciones          = VALUES(opciones),
  precio            = VALUES(precio),
  activo            = VALUES(activo);
