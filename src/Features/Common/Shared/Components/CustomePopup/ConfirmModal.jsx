import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  message = "Are you sure?",
  confirmLabel = "Yes",
  cancelLabel = "No"
}) => {
  if (!show) return null;

  return (
    <div className="custom-modal-confirmation-overlay">
      <div className="custom-modal-confirmation">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-outline-danger" onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-outline-primary" onClick={onClose}>{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
