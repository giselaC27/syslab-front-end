import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onAdd }) => {
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [filter, setFilter] = useState('');

  const services = [
    'Servicio A', 'Servicio B', 'Servicio C', 'Servicio D', 'Servicio E'
    // Agrega más servicios según sea necesario
  ];

  const filteredServices = services.filter(service =>
    service.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedService && quantity > 0) {
      onAdd(selectedService, quantity);
      onClose();
    } else {
      alert('Por favor, seleccione un servicio y una cantidad válida.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-2xl font-bold mb-4" >Añadir Servicio</h2>
        <div className="mb-4">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700">Buscar Servicio</label>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Buscar..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4 overflow-y-auto max-h-48">
          {filteredServices.map(service => (
            <div
              key={service}
              onClick={() => setSelectedService(service)}
              className={`${
                selectedService === service
                  ? 'bg-indigo-100'
                  : 'hover:bg-gray-100'
              } cursor-pointer px-3 py-2 rounded-md`}
            >
              {service}
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
          <div className="flex items-center">
  <input
    type="range"
    id="quantity"
    min="1"
    max="100"
    value={quantity}
    onChange={e => setQuantity(e.target.value)}
    className="mr-4 w-full"
  />
  <input
    type="text"
    value={quantity}
    readOnly
    className="w-16 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
  />
</div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
