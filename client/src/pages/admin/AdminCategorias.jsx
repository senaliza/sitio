import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { IconPlus, IconClose, IconTrash, IconLayers } from '../../components/Icons.jsx';

export default function AdminCategorias() {
  const [cats, setCats] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(null); // 'cat' | 'sub' | null
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', orden: 0 });
  const [subForm, setSubForm] = useState({ nombre: '', categoria_id: '' });
  const [error, setError] = useState('');

  async function cargar() {
    setCargando(true);
    try { setCats(await api.adminCategorias()); } catch (e) { console.error(e); }
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  function nuevaCat() { setEditId(null); setForm({ nombre: '', descripcion: '', orden: 0 }); setError(''); setModal('cat'); }
  function editarCat(c) { setEditId(c.id); setForm({ nombre: c.nombre, descripcion: c.descripcion || '', orden: c.orden || 0 }); setError(''); setModal('cat'); }
  function nuevaSub(catId) { setSubForm({ nombre: '', categoria_id: catId }); setError(''); setModal('sub'); }

  async function guardarCat() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    try {
      if (editId) await api.editarCategoria(editId, form);
      else await api.crearCategoria(form);
      setModal(null); await cargar();
    } catch (e) { setError(e.message); }
  }
  async function guardarSub() {
    if (!subForm.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    try { await api.crearSubcategoria(subForm); setModal(null); await cargar(); }
    catch (e) { setError(e.message); }
  }
  async function eliminarCat(c) {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"? Sus productos quedarán sin categoría.`)) return;
    try { await api.eliminarCategoria(c.id); await cargar(); } catch (e) { alert(e.message); }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Categorías ({cats.length})</h2>
        <button className="btn btn-primario btn-sm" onClick={nuevaCat}><IconPlus /> Nueva categoría</button>
      </div>
      <div className="panel-body">
        {cargando ? <div className="vacio">Cargando…</div>
          : cats.length === 0 ? <div className="vacio">No hay categorías.</div>
            : cats.map((c) => (
              <div key={c.id} className="card" style={{ padding: 18, marginBottom: 14 }}>
                <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div className="fila" style={{ gap: 10, alignItems: 'center' }}>
                      <span style={{ color: 'var(--azul-700)' }}><IconLayers /></span>
                      <strong style={{ fontSize: '1.05rem' }}>{c.nombre}</strong>
                      {!c.activo && <span className="badge badge-gris">Inactiva</span>}
                    </div>
                    {c.descripcion && <p className="muted" style={{ marginTop: 4 }}>{c.descripcion}</p>}
                  </div>
                  <div className="acc">
                    <button className="btn btn-fantasma btn-sm" onClick={() => nuevaSub(c.id)}><IconPlus /> Subcategoría</button>
                    <button className="btn btn-fantasma btn-sm" onClick={() => editarCat(c)}>Editar</button>
                    <button className="btn btn-rojo btn-sm" onClick={() => eliminarCat(c)}><IconTrash /></button>
                  </div>
                </div>
                {c.subcategorias?.length > 0 && (
                  <div className="fila" style={{ flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                    {c.subcategorias.map((s) => (
                      <span key={s.id} className="badge badge-azul">{s.nombre}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
      </div>

      {modal && (
        <div className="modal-fondo" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modal === 'sub' ? 'Nueva subcategoría' : editId ? 'Editar categoría' : 'Nueva categoría'}</h3>
              <button onClick={() => setModal(null)}><IconClose /></button>
            </div>
            <div className="modal-body">
              {error && <div className="alerta alerta-error" style={{ marginBottom: 14 }}>{error}</div>}
              {modal === 'sub' ? (
                <>
                  <label className="lbl">Nombre de la subcategoría *</label>
                  <input className="campo" value={subForm.nombre}
                    onChange={(e) => setSubForm({ ...subForm, nombre: e.target.value })} />
                </>
              ) : (
                <>
                  <label className="lbl">Nombre *</label>
                  <input className="campo" value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                  <label className="lbl" style={{ marginTop: 14 }}>Descripción</label>
                  <textarea className="campo" rows={2} value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                  <label className="lbl" style={{ marginTop: 14 }}>Orden</label>
                  <input className="campo" type="number" value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })} />
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-fantasma" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primario" onClick={modal === 'sub' ? guardarSub : guardarCat}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
