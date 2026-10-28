import { useEffect, useState } from 'react'
import api from '../services/api'
import Modal from '../components/Modal'
import Paginacion from '../components/Paginacion'
import { Actions, Field, ListPage } from './Categorias'

const empty = { nombre: '', email: '', password: '', rol: 'Almacenero' }
function Usuarios() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(empty); const [query, setQuery] = useState(''); const [pagina, setPagina] = useState(1); const [modal, setModal] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const cargar = async () => { try { setLoading(true); setError(''); setItems((await api.get('/usuarios')).data) } catch (err) { setError(err.response?.data?.error || err.message) } finally { setLoading(false) } }; // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar() }, [])
  const filtered = items.filter((x) => `${x.nombre} ${x.email} ${x.rol}`.toLowerCase().includes(query.toLowerCase())); const rows = filtered.slice((pagina - 1) * 5, pagina * 5)
  const submit = async (e) => { e.preventDefault(); try { setError(''); const payload = { ...form }; if (!payload.password) delete payload.password; if (form.id) await api.put(`/usuarios/${form.id}`, payload); else await api.post('/usuarios', payload); setModal(false); setForm(empty); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  const remove = async (id) => { if (!window.confirm('¿Deseas eliminar este usuario?')) return; try { await api.delete(`/usuarios/${id}`); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  return <ListPage title="Usuarios" query={query} setQuery={(v) => { setQuery(v); setPagina(1) }} onNew={() => { setForm(empty); setModal(true) }} error={error} loading={loading}><table className="table table-hover mb-0"><thead className="table-light"><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>{rows.map((x) => <tr key={x.id}><td>{x.id}</td><td>{x.nombre}</td><td>{x.email}</td><td>{x.rol}</td><td><Actions edit={() => { setForm({ ...empty, ...x, password: '' }); setModal(true) }} remove={() => remove(x.id)} /></td></tr>)}</tbody></table><Paginacion pagina={pagina} total={filtered.length} onChange={setPagina} />{modal && <Modal title={form.id ? 'Editar Usuario' : 'Nuevo Usuario'} onClose={() => setModal(false)}><form onSubmit={submit}><Field label="Nombre" name="nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} required /><Field label="Email" name="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required /><Field label={`Password ${form.id ? '(dejar vacío para conservar)' : ''}`} name="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required={!form.id} /><div className="mb-3"><label className="form-label">Rol</label><select className="form-select" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>{['Administrador', 'Almacenero', 'Supervisor'].map((rol) => <option key={rol}>{rol}</option>)}</select></div><button className="btn btn-primary" type="submit">Guardar</button></form></Modal>}</ListPage>
}
export default Usuarios
