// Devuelve true si la fecha ISO cae dentro del rango [desde, hasta] (inclusive).
// `desde` y `hasta` son strings 'YYYY-MM-DD' provenientes de <input type="date">.
export function dentroDeRango(fechaISO, desde, hasta) {
  if (!desde && !hasta) return true;
  const f = new Date(fechaISO);
  if (desde && f < new Date(desde + 'T00:00:00')) return false;
  if (hasta && f > new Date(hasta + 'T23:59:59')) return false;
  return true;
}
