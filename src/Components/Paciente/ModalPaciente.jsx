import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
