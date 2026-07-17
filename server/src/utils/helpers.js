// Utilidades del servidor

export function slugify(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function codigoPedido(id) {
  return `SEN-${String(id).padStart(6, '0')}`;
}

/**
 * Calcula el total del pedido como precio plano final.
 * Total = suma de (precio_unitario * cantidad). NO se suma IVA ni cargo alguno.
 */
export function calcularTotal(items = []) {
  return items.reduce((acc, it) => {
    const precio = Number(it.precio_unitario) || 0;
    const cantidad = Number(it.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);
}
