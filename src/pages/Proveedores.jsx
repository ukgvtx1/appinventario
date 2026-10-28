import { useEffect, useState } from 'react'
import api from '../services/api'
import Modal from '../components/Modal'
import Paginacion from '../components/Paginacion'
import { Actions, Field, ListPage } from './Categorias'

const empty = { razon_social: '', contacto: '', telefono: '', email: '' }
function Proveedores() {
  const [items, setItems] = useState([]); const [form, setForm] = useState(empty); const [query, setQuery] = useState(''); const [pagina, setPagina] = useState(1); const [modal, setModal] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const cargar = async () => { try { setLoading(true); setError(''); setItems((await api.get('/proveedores')).data) } catch (err) { setError(err.response?.data?.error || err.message) } finally { setLoading(false) } }; // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { cargar() }, [])
  const filtered = items.filter((x) => Object.values(x).join(' ').toLowerCase().includes(query.toLowerCase())); const rows = filtered.slice((pagina - 1) * 5, pagina * 5)
  const submit = async (e) => { e.preventDefault(); try { setError(''); if (form.id) await api.put(`/proveedores/${form.id}`, form); else await api.post('/proveedores', form); setModal(false); setForm(empty); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  const remove = async (id) => { if (!window.confirm('¿Deseas eliminar este proveedor?')) return; try { await api.delete(`/proveedores/${id}`); cargar() } catch (err) { setError(err.response?.data?.error || err.message) } }
  return <ListPage title="Proveedores" query={query} setQuery={(v) => { setQuery(v); setPagina(1) }} onNew={() => { setForm(empty); setModal(true) }} error={error} loading={loading}><table className="table table-hover mb-0"><thead className="table-light"><tr><th>ID</th><th>Razón Social</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr></thead><tbody>{rows.map((x) => <tr key={x.id}><td>{x.id}</td><td>{x.razon_social}</td><td>{x.contacto}</td><td>{x.telefono}</td><td>{x.email}</td><td><Actions edit={() => { setForm(x); setModal(true) }} remove={() => remove(x.id)} /></td></tr>)}</tbody></table><Paginacion pagina={pagina} total={filtered.length} onChange={setPagina} />{modal && <Modal title={form.id ? 'Editar Proveedor' : 'Nuevo Proveedor'} onClose={() => setModal(false)}><form onSubmit={submit}>{[['razon_social', 'Razón Social'], ['contacto', 'Contacto'], ['telefono', 'Teléfono']].map(([name, label]) => <Field key={name} label={label} name={name} value={form[name]} onChange={(v) => setForm({ ...form, [name]: v })} required={name === 'razon_social'} />)}<div className="mb-3"><label className="form-label">Email</label><input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><button className="btn btn-primary" type="submit">Guardar</button></form></Modal>}</ListPage>
}
export default Proveedores
