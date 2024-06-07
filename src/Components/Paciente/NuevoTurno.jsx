import React, { useState } from 'react';
import Modal from './Modal';

const NuevoTurno = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddService = (service, quantity) => {
    console.log('Servicio añadido:', service, 'Cantidad:', quantity);
    // Aquí puedes manejar la lógica para añadir el servicio a la tabla
  };

  return (
    <div className="p-8 w-full">      
      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Nuevos Turnos</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        <div>
          <label htmlFor="ci-paciente" className="block text-sm font-medium text-gray-700">CI Paciente</label>
          <input type="text" id="ci-paciente" className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="flex items-end">
          <div className="flex-1">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" id="nombre" className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <button className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Generar Turno</button>
        </div>
      </div>
      <div className="mt-6">
        <label htmlFor="cargo-empresa" className="block text-sm font-medium text-gray-700">Cargo Empresa</label>
        <select id="cargo-empresa" className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option>Seleccione un cargo</option>
          {/* Añadir más opciones según sea necesario */}
        </select>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Generar Proforma</button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Limpiar</button>
        <button onClick={handleOpenModal} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Añadir Servicio</button>
      </div>
      <div className="mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Numero</th>
              <th className="px-4 py-2">Servicio</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Descuento</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Añadir filas dinámicamente aquí */}
            <tr className="bg-white border-b border-gray-200">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">Servicio A</td>
              <td className="px-4 py-2">Área 1</td>
              <td className="px-4 py-2">$100</td>
              <td className="px-4 py-2">$10</td>
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">$90</td>
              <td className="px-4 py-2">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">Editar</button>
                <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
              </td>
            </tr>
            {/* Más filas según sea necesario */}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-end space-x-4">
        <label htmlFor="total-a-pagar" className="block text-sm font-medium text-gray-700">Total a Pagar</label>
        <input type="text" id="total-a-pagar" readOnly className="ml-4 block w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Imprimir</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onAdd={handleAddService} />
    </div>
  );
};

export default NuevoTurno;
