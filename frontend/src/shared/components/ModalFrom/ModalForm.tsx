import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] p-8 relative animate-fadeIn flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-heading mb-4 text-center border-b pb-3">
          {title}
        </h2>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pr-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
