import React from "react";
import Modal from "../ModalFrom/ModalForm";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
  <p className="mb-6 text-black">{message}</p>
  <div className="flex justify-end gap-4">
    <button
      onClick={onCancel}
      className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-black"
    >
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      className="py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
    >
      {confirmText}
    </button>
  </div>
</Modal>
  );
};

export default ConfirmDialog;
