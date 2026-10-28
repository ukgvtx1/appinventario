import { useEffect, useState } from 'react'
import api from '../services/api'
import Modal from '../components/Modal'
import Paginacion from '../components/Paginacion'

const empty = { nombre: '', descripcion: '' }
function Categorias() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(empty); const [query, setQuery] = useState(''); const [pagina, setPagina] = useState(1); const [modal, setModal] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const cargar = async () => { try { setLoading(true); setError(''); setItems((await api.get('/categorias')).data) } catch (err) { setError(err.response?.data?.error || err.message) } finally { setLoading(false) } }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar() }, [])
  const filtered = items.filter((x) => `${x.nombre} ${x.descripcion || ''}`.toLowerCase().includes(query.toLowerCase())); const rows = filtered.slice((pagina - 1) * 5, pagina * 5)
  const submit = async (e) => { e.preventDefault(); try { setError(''); if (form.id) await api.put(`/categorias/${form.id}`, form); else await api.post('/categorias', form); setModal(false); setForm(empty); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  const remove = async (id) => { if (!window.confirm('¿Deseas eliminar esta categoría?')) return; try { await api.delete(`/categorias/${id}`); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  return <ListPage title="Categorías" query={query} setQuery={(v) => { setQuery(v); setPagina(1) }} onNew={() => { setForm(empty); setModal(true) }} error={error} loading={loading}><table className="table table-hover mb-0"><thead className="table-light"><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Cant. Productos</th><th>Acciones</th></tr></thead><tbody>{rows.map((x) => <tr key={x.id}><td>{x.id}</td><td>{x.nombre}</td><td>{x.descripcion}</td><td>{x.cantidad_productos}</td><td><Actions edit={() => { setForm(x); setModal(true) }} remove={() => remove(x.id)} /></td></tr>)}</tbody></table><Paginacion pagina={pagina} total={filtered.length} onChange={setPagina} />{modal && <Modal title={form.id ? 'Editar Categoría' : 'Nueva Categoría'} onClose={() => setModal(false)}><form id="categoria-form" onSubmit={submit}><Field label="Nombre" name="nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} required /><Field label="Descripción" name="descripcion" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} /><button className="btn btn-primary" type="submit">Guardar</button></form></Modal>}</ListPage>
}

function ListPage({ title, query, setQuery, onNew, error, loading, children }) { return <><div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3"><h2 className="h4 mb-0">{title}</h2><button className="btn btn-primary" onClick={onNew}>+ Nuevo {title.slice(0, -1)}</button></div><div className="card p-3"><input className="form-control mb-3" placeholder={`Buscar ${title.toLowerCase()}...`} value={query} onChange={(e) => setQuery(e.target.value)} />{error && <div className="alert alert-danger">{error}</div>}{loading ? <div className="text-center p-4"><div className="spinner-border" /></div> : <div className="table-responsive">{children}</div>}</div></> }
function Actions({ edit, remove }) { return <><button className="btn btn-outline-warning btn-sm me-1" onClick={edit}>Editar</button><button className="btn btn-outline-danger btn-sm" onClick={remove}>Eliminar</button></> }
function Field({ label, name, value, onChange, required }) { return <div className="mb-3"><label className="form-label">{label}</label><input className="form-control" name={name} value={value || ''} onChange={(e) => onChange(e.target.value)} required={required} /></div> }
export { Actions, Field, ListPage }
export default Categorias
