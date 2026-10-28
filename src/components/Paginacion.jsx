function Paginacion({ pagina, total, porPagina = 5, onChange }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  const inicio = total === 0 ? 0 : (pagina - 1) * porPagina + 1
  const fin = Math.min(pagina * porPagina, total)
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
      <small className="text-muted">Mostrando {inicio}-{fin} de {total} registros</small>
      <nav aria-label="Paginación">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onChange(pagina - 1)} disabled={pagina === 1}>Anterior</button>
          </li>
          {Array.from({ length: paginas }, (_, i) => i + 1).map((numero) => (
            <li className={`page-item ${numero === pagina ? 'active' : ''}`} key={numero}>
              <button className="page-link" onClick={() => onChange(numero)}>{numero}</button>
            </li>
          ))}
          <li className={`page-item ${pagina === paginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onChange(pagina + 1)} disabled={pagina === paginas}>Siguiente</button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Paginacion
