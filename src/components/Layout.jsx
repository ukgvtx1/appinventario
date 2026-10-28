import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  ['/', 'Inicio', 'bi-house'],
  ['/productos', 'Productos', 'bi-box-seam'],
  ['/categorias', 'Categorías', 'bi-tags'],
  ['/proveedores', 'Proveedores', 'bi-truck'],
  ['/kardex', 'Kardex / Movimientos', 'bi-arrow-left-right'],
  ['/usuarios', 'Usuarios', 'bi-people'],
]

function Layout() {
  const [abierto, setAbierto] = useState(false)
  const location = useLocation()
  const seccion = links.find(([path]) => path === location.pathname)?.[1] || 'Panel'
  return (
    <div className="admin-shell">
      <aside className={`sidebar ${abierto ? 'show' : ''}`}>
        <div className="sidebar-brand">SENATI - Sistema de Inventario</div>
        <nav className="nav flex-column">
          {links.map(([path, label, icon]) => (
            <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setAbierto(false)}>
              <i className={`bi ${icon} me-2`} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {abierto && <div className="sidebar-overlay d-lg-none" onClick={() => setAbierto(false)} />}
      <main className="main-content">
        <header className="topbar">
          <button className="btn btn-outline-secondary d-lg-none" onClick={() => setAbierto(!abierto)} aria-label="Abrir menú">☰</button>
          <h1 className="h5 mb-0">{seccion}</h1>
          <span className="text-muted small">Panel administrativo</span>
        </header>
        <div className="container-fluid p-3 p-md-4"><Outlet /></div>
      </main>
    </div>
  )
}

export default Layout
