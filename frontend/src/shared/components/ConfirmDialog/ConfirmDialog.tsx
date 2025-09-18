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
      <p className="mb-6 text-gray-800 text-lg">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="py-2 px-5 rounded-full border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="py-2 px-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold hover:from-red-600 hover:to-pink-600 shadow-lg transition transform hover:scale-105"
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
