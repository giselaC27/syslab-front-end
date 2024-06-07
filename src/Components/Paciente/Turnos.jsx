import React, { useState } from 'react';

const Turnos = () => {
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [turnosPendientes, setTurnosPendientes] = useState(5); // Número de turnos pendientes
  const [turnosPagados, setTurnosPagados] = useState(10); // Número de turnos pagados

  const handleVerDetalle = (turno) => {
    setSelectedTurno(turno);
  };

  const turnos = [
    { nro: 1, fecha: '2024-05-01', ci: '1234567890', nombre: 'Juan Pérez', total: 100, estado: 'Pendiente' },
    { nro: 2, fecha: '2024-05-02', ci: '0987654321', nombre: 'María Gómez', total: 200, estado: 'Pagado' },
    // Más turnos...
  ];

  return (
    <div className="p-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-indigo-500">Turnos</h1>
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="buscar" className="block text-sm font-medium text-gray-700">Buscar</label>
        <input
          type="text"
          id="buscar"
          className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Buscar</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium">Turnos Pendientes {turnosPendientes}</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium">Turnos Pagados {turnosPagados}</button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cupos</button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Nro de Turno</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">CI Paciente</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Detalle</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map(turno => (
              <tr key={turno.nro} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2">{turno.nro}</td>
                <td className="px-4 py-2">{turno.fecha}</td>
                <td className="px-4 py-2">{turno.ci}</td>
                <td className="px-4 py-2">{turno.nombre}</td>
                <td className="px-4 py-2">${turno.total}</td>
                <td className="px-4 py-2">{turno.estado}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium"
                    onClick={() => handleVerDetalle(turno)}
                  >
                    Ver Detalle
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">Editar</button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTurno && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">DETALLE</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nro de Turno</label>
              <input
                type="text"
                value={selectedTurno.nro}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CI Paciente</label>
              <input
                type="text"
                value={selectedTurno.ci}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={selectedTurno.nombre}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="text"
                value={selectedTurno.total}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                value={selectedTurno.estado}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Número</th>
                  <th className="px-4 py-2">Servicio</th>
                  <th className="px-4 py-2">Área</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Descuento</th>
                  <th className="px-4 py-2">Cantidad</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Aquí añadirías los detalles del turno seleccionado */}
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Servicio A</td>
                  <td className="px-4 py-2">Área 1</td>
                  <td className="px-4 py-2">$50</td>
                  <td className="px-4 py-2">$5</td>
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">$45</td>
                </tr>
                {/* Más detalles según sea necesario */}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Marcar como Pagado</button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Recepción de Muestras</button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Eliminar Turno</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
