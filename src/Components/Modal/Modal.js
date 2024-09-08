import React from "react";
import "./Modal.css";
function Modal({ show, title, message, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-button confirm">
            Yes delete
          </button>
          <button onClick={onClose} className="modal-button cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
