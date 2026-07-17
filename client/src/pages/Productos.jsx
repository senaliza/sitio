import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';
import ProductoCard from '../components/ProductoCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { IconSearch } from '../components/Icons.jsx';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [catActiva, setCatActiva] = useState('');

  useEffect(() => {
    Promise.all([api.productos(), api.categorias()])
      .then(([p, c]) => { setProductos(p); setCategorias(c); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return productos.filter((p) => {
      const okCat = !catActiva || p.categoria_slug === catActiva;
      const okBuscar = !q || p.nombre.toLowerCase().includes(q) ||
        (p.descripcion_corta || '').toLowerCase().includes(q);
      return okCat && okBuscar;
    });
  }, [productos, buscar, catActiva]);

  return (
    <>
      <section className="page-head">
        <div className="contenedor">
          <h1 className="seccion-titulo">Nuestros productos</h1>
          <p style={{ maxWidth: 600 }}>
            Explore nuestras soluciones por categoría. Los precios mostrados son finales.
          </p>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: 40, background: '#ffffff' }}>
        <div className="contenedor">
          {/* Buscador */}
          <div className="buscador">
            <IconSearch size={19} />
            <input value={buscar} onChange={(e) => setBuscar(e.target.value)}
              placeholder="Buscar producto..." />
          </div>

          {/* Filtros por categoría */}
          <div className="filtros">
            <button className={`filtro ${!catActiva ? 'on' : ''}`} onClick={() => setCatActiva('')}>Todos</button>
            {categorias.map((c) => (
              <button key={c.id} className={`filtro ${catActiva === c.slug ? 'on' : ''}`}
                onClick={() => setCatActiva(c.slug)}>{c.nombre}</button>
            ))}
          </div>

          {cargando ? (
            <p className="muted">Cargando productos...</p>
          ) : filtrados.length === 0 ? (
            <p className="muted">No se encontraron productos.</p>
          ) : (
            <div className="cat-grid">
              {filtrados.map((p, i) => (
                <Reveal as="div" key={p.id} delay={(i % 4) * 80}>
                  <ProductoCard producto={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .buscador { display: flex; align-items: center; gap: 10px; max-width: 440px; background: var(--gris-50);
          border: 1.5px solid var(--gris-200); border-radius: var(--radio-pill); padding: 12px 18px; color: var(--gris-500); margin-bottom: 22px;
          transition: border var(--transicion), box-shadow var(--transicion), background var(--transicion); }
        .buscador:focus-within { border-color: var(--azul-600); background: #fff; box-shadow: 0 0 0 3px var(--azul-100); }
        .buscador input { border: none; background: none; outline: none; width: 100%; font-family: var(--fuente-texto); font-size: 0.98rem; color: var(--texto); }
        .filtros { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
        .filtro { border: 1.5px solid var(--gris-200); background: #fff; color: var(--gris-700);
          padding: 9px 19px; border-radius: var(--radio-pill); font-weight: 700; font-size: 0.9rem; cursor: pointer;
          transition: transform var(--transicion), border-color var(--transicion), color var(--transicion), box-shadow var(--transicion); font-family: var(--fuente-texto); }
        .filtro:hover { border-color: var(--azul-600); color: var(--azul-700); transform: translateY(-1px); }
        .filtro.on { background: var(--grad-marca); border-color: transparent; color: #fff; box-shadow: var(--sombra-azul); }
        .cat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
        @media (max-width: 980px) { .cat-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 760px) { .cat-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .cat-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
