import { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const cargar = async () => {
      try { setData((await api.get('/dashboard')).data) } catch (err) { setError(err.response?.data?.error || err.message) }
    }
    cargar()
  }, [])
  if (error) return <div className="alert alert-danger">Error: {error}</div>
  if (!data) return <div className="text-center p-5"><div className="spinner-border" role="status" /></div>
  const kpis = [['Total Productos', data.total_productos, 'primary'], ['Categorías', data.total_categorias, 'success'], ['Proveedores', data.total_proveedores, 'info'], ['Bajo Stock', data.bajo_stock, 'danger']]
  return <div>
    <h2 className="h4 mb-4">Resumen general</h2>
    <div className="row g-3 mb-4">{kpis.map(([label, value, color]) => <div className="col-sm-6 col-xl-3" key={label}><div className="card p-3"><span className="text-muted">{label}</span><span className={`kpi-value text-${color}`}>{value}</span></div></div>)}</div>
    <div className="row g-4">
      <div className="col-xl-7"><div className="card p-3"><h3 className="h6">Movimientos Recientes (Kardex)</h3><div className="table-responsive"><table className="table table-sm"><thead><tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Usuario</th></tr></thead><tbody>{(data.movimientos_recientes || []).map((m) => <tr key={m.id}><td>{new Date(m.fecha_hora).toLocaleDateString('es-PE')}</td><td>{m.producto?.nombre}</td><td>{m.tipo_movimiento}</td><td>{m.cantidad > 0 ? '+' : ''}{m.cantidad}</td><td>{m.usuario?.nombre}</td></tr>)}</tbody></table></div></div></div>
      <div className="col-xl-5"><div className="card p-3"><h3 className="h6">Stock por Categoría</h3>{(data.stock_por_categoria || []).map((item) => { const max = Math.max(...(data.stock_por_categoria || []).map((x) => x.stock_total), 1); return <div className="mb-3" key={item.categoria}><div className="d-flex justify-content-between small"><span>{item.categoria}</span><strong>{item.stock_total}</strong></div><div className="progress"><div className="progress-bar" style={{ width: `${(item.stock_total / max) * 100}%` }} /></div></div> })}</div></div>
    </div>
  </div>
}
export default Dashboard
