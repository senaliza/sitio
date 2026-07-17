import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatearPrecio } from '../../services/api.js';
import Reveal from '../../components/Reveal.jsx';
import CountUp from '../../components/CountUp.jsx';
import { IconBox, IconCard, IconClipboard, IconCheck } from '../../components/Icons.jsx';

const ESTADO_BADGE = {
  pendiente: 'badge-gris',
  en_revision: 'badge-amarillo',
  pago_pendiente: 'badge-amarillo',
  pago_recibido: 'badge-azul',
  confirmado: 'badge-verde',
  rechazado: 'badge-rojo',
  completado: 'badge-verde',
};
const ESTADO_TXT = {
  pendiente: 'Pendiente', en_revision: 'En revisión', pago_pendiente: 'Pago pendiente',
  pago_recibido: 'Pago recibido', confirmado: 'Confirmado', rechazado: 'Rechazado', completado: 'Completado',
};

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [animBars, setAnimBars] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, pe, c] = await Promise.all([
          api.adminProductos(), api.adminPedidos(), api.adminCotizaciones(),
        ]);
        setProductos(p); setPedidos(pe); setCotizaciones(c);
      } catch (e) { console.error(e); }
      setCargando(false);
    })();
  }, []);

  // Anima las barras del gráfico al terminar de cargar.
  useEffect(() => {
    if (cargando) return;
    const t = setTimeout(() => setAnimBars(true), 150);
    return () => clearTimeout(t);
  }, [cargando]);

  const ingresos = pedidos
    .filter((p) => p.estado_pago === 'pagado')
    .reduce((s, p) => s + Number(p.total || 0), 0);
  const cotPend = cotizaciones.filter((c) => c.estado === 'pendiente').length;

  const cards = [
    { icon: IconBox, fin: productos.length, etq: 'Productos publicados' },
    { icon: IconCard, fin: pedidos.length, etq: 'Pedidos recibidos' },
    { icon: IconClipboard, fin: cotPend, etq: 'Cotizaciones por revisar' },
    { icon: IconCheck, fin: ingresos, etq: 'Ingresos confirmados', prefijo: '₡ ' },
  ];

  // Distribución de pedidos por estado (derivado de los datos ya cargados).
  const conteo = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});
  const distrib = Object.entries(conteo)
    .map(([estado, n]) => ({ estado, n }))
    .sort((a, b) => b.n - a.n);
  const maxN = distrib.reduce((m, d) => Math.max(m, d.n), 0) || 1;

  return (
    <>
      <div className="stat-grid">
        {cards.map((c, i) => {
          const Ico = c.icon;
          return (
            <Reveal as="div" className="stat-card" key={i} delay={i * 80}>
              <div className="icono"><Ico /></div>
              <div className="num">
                {cargando ? '…' : <CountUp fin={c.fin} prefijo={c.prefijo || ''} duracion={1500} />}
              </div>
              <div className="etq">{c.etq}</div>
            </Reveal>
          );
        })}
      </div>

      <div className="admin-grid-2">
        <Reveal as="div" className="panel">
          <div className="panel-head">
            <h2>Pedidos recientes</h2>
            <Link to="/admin/pedidos" className="btn btn-fantasma btn-sm">Ver todos</Link>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {pedidos.length === 0 ? (
              <div className="vacio">Aún no hay pedidos registrados.</div>
            ) : (
              <table className="tabla">
                <thead>
                  <tr><th>Código</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Pago</th></tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.codigo}</strong></td>
                      <td>{p.cliente_nombre}</td>
                      <td>{formatearPrecio(p.total)}</td>
                      <td><span className={`badge ${ESTADO_BADGE[p.estado] || 'badge-gris'}`}>{ESTADO_TXT[p.estado]}</span></td>
                      <td><span className={`badge ${p.estado_pago === 'pagado' ? 'badge-verde' : p.estado_pago === 'rechazado' ? 'badge-rojo' : 'badge-gris'}`}>{p.estado_pago}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Reveal>

        <Reveal as="div" className="panel" delay={120}>
          <div className="panel-head">
            <h2>Pedidos por estado</h2>
          </div>
          <div className="panel-body">
            {distrib.length === 0 ? (
              <div className="chart-vacio">Sin datos para mostrar todavía.</div>
            ) : (
              <div className="chart-barras">
                {distrib.map((d) => (
                  <div className="chart-fila" key={d.estado}>
                    <span className="chart-lbl">{ESTADO_TXT[d.estado] || d.estado}</span>
                    <span className="chart-pista">
                      <span
                        className="chart-relleno"
                        style={{ width: animBars ? `${Math.max((d.n / maxN) * 100, 6)}%` : 0 }}
                      />
                    </span>
                    <span className="chart-val">{d.n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
