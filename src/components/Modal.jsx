function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal-dialog modal-dialog-scrollable position-relative">
        <div className="modal-content position-relative">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

export default Modal
