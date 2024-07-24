import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Descuento = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descuentos, setDescuentos] = useState([]);
  const [tiposCliente, setTiposCliente] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [nuevoDescuento, setNuevoDescuento] = useState({
    tipoCliente: '',
    servicio: '',
    porcentaje: 0,
  });
  const [error, setError] = useState('');
  const [filtroServicio, setFiltroServicio] = useState('');

  useEffect(() => {
    setTiposCliente(['Regular', 'VIP', 'Corporativo']);
    setServicios([
      { id: 1, codigo: 'SERV001', nombre: 'Servicio 1', precio: 100 },
      { id: 2, codigo: 'SERV002', nombre: 'Servicio 2', precio: 200 },
      { id: 3, codigo: 'SERV003', nombre: 'Servicio 3', precio: 150 },
      { id: 4, codigo: 'SERV004', nombre: 'Servicio 4', precio: 300 },

    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoDescuento({ ...nuevoDescuento, [name]: value });
    setError('');
  };

  const calcularTotalConDescuento = () => {
    const servicio = servicios.find(s => s.id === parseInt(nuevoDescuento.servicio));
    if (servicio) {
      const descuento = servicio.precio * (nuevoDescuento.porcentaje / 100);
      return servicio.precio - descuento;
    }
    return 0;
  };

  const handleGuardar = () => {
    if (!nuevoDescuento.tipoCliente || !nuevoDescuento.servicio || nuevoDescuento.porcentaje === 0) {
      setError('Por favor, complete todos los campos antes de guardar.');
      return;
    }

    const servicio = servicios.find(s => s.id === parseInt(nuevoDescuento.servicio));
    if (servicio) {
      const nuevoDescuentoCompleto = {
        ...nuevoDescuento,
        idDescuento: Date.now(),
        codigoServicio: servicio.codigo,
        nombreServicio: servicio.nombre,
        precio: servicio.precio,
        totalConDescuento: calcularTotalConDescuento(),
      };
      setDescuentos([...descuentos, nuevoDescuentoCompleto]);
      setIsModalOpen(false);
      setNuevoDescuento({ tipoCliente: '', servicio: '', porcentaje: 0 });
      setError('');
    }
  };

  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.nombre.toLowerCase().includes(filtroServicio.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Descuento
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-indigo-500 text-white">
          <tr>
            <th className="py-2 px-4 border-b">ID Descuento</th>
            <th className="py-2 px-4 border-b">Tipo Cliente</th>
            <th className="py-2 px-4 border-b">Código Servicio</th>
            <th className="py-2 px-4 border-b">Nombre Servicio</th>
            <th className="py-2 px-4 border-b">Precio</th>
            <th className="py-2 px-4 border-b">% Descuento</th>
            <th className="py-2 px-4 border-b">Total con Descuento</th>
          </tr>
        </thead>
        <tbody>
          {descuentos.map((descuento) => (
            <tr key={descuento.idDescuento}>
              <td className="py-2 px-4 border-b">{descuento.idDescuento}</td>
              <td className="py-2 px-4 border-b">{descuento.tipoCliente}</td>
              <td className="py-2 px-4 border-b">{descuento.codigoServicio}</td>
              <td className="py-2 px-4 border-b">{descuento.nombreServicio}</td>
              <td className="py-2 px-4 border-b">${descuento.precio}</td>
              <td className="py-2 px-4 border-b">{descuento.porcentaje}%</td>
              <td className="py-2 px-4 border-b">${descuento.totalConDescuento.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Agregar Descuento</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block mb-2">Tipo Cliente</label>
              <select
                name="tipoCliente"
                value={nuevoDescuento.tipoCliente}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar Tipo Cliente</option>
                {tiposCliente.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Buscar Servicio</label>
              <input
                type="text"
                value={filtroServicio}
                onChange={(e) => setFiltroServicio(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Buscar servicio..."
              />
              <div className="max-h-40 overflow-y-auto">
                {serviciosFiltrados.map((servicio) => (
                  <div
                    key={servicio.id}
                    onClick={() => setNuevoDescuento({ ...nuevoDescuento, servicio: servicio.id.toString() })}
                    className={`cursor-pointer p-2 ${nuevoDescuento.servicio === servicio.id.toString() ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    {servicio.nombre}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Porcentaje de Descuento: {nuevoDescuento.porcentaje}%</label>
              <input
                type="range"
                name="porcentaje"
                min="0"
                max="100"
                value={nuevoDescuento.porcentaje}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Total con Descuento: ${calcularTotalConDescuento().toFixed(2)}</label>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Descuento;