import { useEffect, useState, useMemo } from "react";
import { api, formatearPrecio, urlImagen } from "../../services/api.js";
import { IconPlus, IconClose, IconTrash } from "../../components/Icons.jsx";

const VACIO = {
  nombre: "",
  categoria_id: "",
  subcategoria_id: "",
  descripcion_corta: "",
  descripcion: "",
  opciones: "",
  precio: "",
  destacado: false,
  activo: "1",
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [archivo, setArchivo] = useState(null);
  const [imagenActual, setImagenActual] = useState(null); // ruta de la imagen ya guardada
  const [preview, setPreview] = useState(null); // vista previa del archivo nuevo
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  function elegirArchivo(f) {
    setArchivo(f || null);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  // Filtros
  const [buscar, setBuscar] = useState("");
  const [fCat, setFCat] = useState("");
  const [fEstado, setFEstado] = useState("");

  async function cargar() {
    setCargando(true);
    try {
      const [p, c] = await Promise.all([
        api.adminProductos(),
        api.adminCategorias(),
      ]);
      setProductos(p);
      setCategorias(c);
    } catch (e) {
      console.error(e);
    }
    setCargando(false);
  }
  useEffect(() => {
    cargar();
  }, []);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return productos.filter((p) => {
      if (
        q &&
        !(
          (p.nombre || "").toLowerCase().includes(q) ||
          (p.descripcion_corta || "").toLowerCase().includes(q)
        )
      )
        return false;
      if (fCat && String(p.categoria_id) !== String(fCat)) return false;
      if (fEstado === "activo" && !p.activo) return false;
      if (fEstado === "inactivo" && p.activo) return false;
      return true;
    });
  }, [productos, buscar, fCat, fEstado]);

  const hayFiltros = buscar || fCat || fEstado;
  function limpiar() {
    setBuscar("");
    setFCat("");
    setFEstado("");
  }

  function abrirNuevo() {
    setEditId(null);
    setForm(VACIO);
    setArchivo(null);
    setPreview(null);
    setImagenActual(null);
    setError("");
    setModal(true);
  }
  function abrirEditar(p) {
    setEditId(p.id);
    setForm({
      nombre: p.nombre || "",
      categoria_id: p.categoria_id || "",
      subcategoria_id: p.subcategoria_id || "",
      descripcion_corta: p.descripcion_corta || "",
      descripcion: p.descripcion || "",
      opciones: p.opciones || "",
      precio: p.precio == null ? "" : p.precio,
      destacado: !!p.destacado,
      activo: p.activo ? "1" : "0",
    });
    setArchivo(null);
    setPreview(null);
    setImagenActual(p.imagen || null);
    setError("");
    setModal(true);
  }

  const subcats =
    categorias.find((c) => String(c.id) === String(form.categoria_id))
      ?.subcategorias || [];

  async function guardar() {
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "destacado") fd.append(k, v ? "1" : "0");
        else fd.append(k, v ?? "");
      });
      if (archivo) fd.append("imagen", archivo);
      if (editId) await api.editarProducto(editId, fd);
      else await api.crearProducto(fd);
      setModal(false);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
    setGuardando(false);
  }

  async function eliminar(p) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await api.eliminarProducto(p.id);
      await cargar();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Productos ({productos.length})</h2>
        <button className="btn btn-primario btn-sm" onClick={abrirNuevo}>
          <IconPlus /> Nuevo producto
        </button>
      </div>

      <div className="adm-filtros">
        <div className="adm-f adm-f-buscar">
          <label>Buscar</label>
          <input
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            placeholder="Nombre o descripción…"
          />
        </div>
        <div className="adm-f">
          <label>Categoría</label>
          <select value={fCat} onChange={(e) => setFCat(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="adm-f">
          <label>Estado</label>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        {hayFiltros && (
          <button className="adm-f-limpiar" onClick={limpiar}>
            Limpiar
          </button>
        )}
        <span className="adm-f-conteo">
          {filtrados.length} de {productos.length}
        </span>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {cargando ? (
          <div className="vacio">Cargando…</div>
        ) : productos.length === 0 ? (
          <div className="vacio">No hay productos. Crea el primero.</div>
        ) : filtrados.length === 0 ? (
          <div className="vacio">Ningún producto coincide con los filtros.</div>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imagen ? (
                      <img
                        className="miniimg"
                        src={urlImagen(p.imagen)}
                        alt=""
                      />
                    ) : (
                      <div className="miniimg" />
                    )}
                  </td>
                  <td>
                    <strong>{p.nombre}</strong>
                    {p.destacado ? (
                      <span
                        className="badge badge-azul"
                        style={{ marginLeft: 8 }}
                      >
                        Destacado
                      </span>
                    ) : null}
                  </td>
                  <td>
                    {p.categoria_nombre ||
                      categorias.find((c) => c.id === p.categoria_id)?.nombre ||
                      "—"}
                  </td>
                  <td>
                    {p.precio == null ? (
                      <em className="muted">A cotizar</em>
                    ) : (
                      formatearPrecio(p.precio)
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${p.activo ? "badge-verde" : "badge-gris"}`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="acc">
                      <button
                        className="btn btn-fantasma btn-sm"
                        onClick={() => abrirEditar(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-rojo btn-sm"
                        onClick={() => eliminar(p)}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-fondo" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editId ? "Editar producto" : "Nuevo producto"}</h3>
              <button onClick={() => setModal(false)}>
                <IconClose />
              </button>
            </div>
            <div className="modal-body">
              {error && (
                <div
                  className="alerta alerta-error"
                  style={{ marginBottom: 14 }}
                >
                  {error}
                </div>
              )}
              <label className="lbl">Nombre *</label>
              <input
                className="campo"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />

              <div className="campo-row" style={{ marginTop: 14 }}>
                <div>
                  <label className="lbl">Categoría</label>
                  <select
                    className="campo"
                    value={form.categoria_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria_id: e.target.value,
                        subcategoria_id: "",
                      })
                    }
                  >
                    <option value="">— Sin categoría —</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="lbl">Subcategoría</label>
                  <select
                    className="campo"
                    value={form.subcategoria_id}
                    disabled={!subcats.length}
                    onChange={(e) =>
                      setForm({ ...form, subcategoria_id: e.target.value })
                    }
                  >
                    <option value="">— Ninguna —</option>
                    {subcats.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="lbl" style={{ marginTop: 14 }}>
                Descripción corta
              </label>
              <input
                className="campo"
                value={form.descripcion_corta}
                onChange={(e) =>
                  setForm({ ...form, descripcion_corta: e.target.value })
                }
              />

              <label className="lbl" style={{ marginTop: 14 }}>
                Descripción completa
              </label>
              <textarea
                className="campo"
                rows={3}
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
              />

              <label className="lbl" style={{ marginTop: 14 }}>
                Opciones (texto libre o JSON, opcional)
              </label>
              <input
                className="campo"
                value={form.opciones}
                onChange={(e) => setForm({ ...form, opciones: e.target.value })}
              />

              <div className="campo-row" style={{ marginTop: 14 }}>
                <div>
                  <label className="lbl">Precio plano</label>
                  <input
                    className="campo"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ej. 4000"
                    value={form.precio}
                    onChange={(e) =>
                      setForm({ ...form, precio: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="lbl">Estado</label>
                  <select
                    className="campo"
                    value={form.activo}
                    onChange={(e) =>
                      setForm({ ...form, activo: e.target.value })
                    }
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>

              <label className="lbl" style={{ marginTop: 14 }}>
                Imagen del producto
              </label>
              <div
                style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                {preview || imagenActual ? (
                  <img
                    src={preview || urlImagen(imagenActual)}
                    alt="Vista previa"
                    style={{
                      width: 96,
                      height: 96,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid var(--gris-200)",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 12,
                      border: "1px dashed var(--gris-300)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--gris-500)",
                      fontSize: ".72rem",
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    Sin imagen
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => elegirArchivo(e.target.files[0])}
                  />
                  <p
                    className="muted"
                    style={{ fontSize: ".8rem", marginTop: 8 }}
                  >
                    {editId
                      ? preview
                        ? "La imagen actual se reemplazará al guardar."
                        : "Suba un archivo para reemplazar la imagen actual."
                      : "JPG o PNG. Recomendado 1200×900 px."}
                  </p>
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 16,
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) =>
                    setForm({ ...form, destacado: e.target.checked })
                  }
                />
                Mostrar como destacado en inicio
              </label>
            </div>
            <div className="modal-foot">
              <button
                className="btn btn-fantasma"
                onClick={() => setModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primario"
                onClick={guardar}
                disabled={guardando}
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
