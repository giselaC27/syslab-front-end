import React, { useState } from 'react';

const Servicios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [areas, setAreas] = useState([
    { id: 1, name: 'Área 1', servicios: ['Servicio 1', 'Servicio 2'] },
    { id: 2, name: 'Área 2', servicios: ['Servicio 3', 'Servicio 4'] }
  ]);
  const [newArea, setNewArea] = useState('');
  const [newService, setNewService] = useState({ areaId: '', nombre: '', unidad: '', rango: '', precio: '' });
  const [expandedAreaId, setExpandedAreaId] = useState(null); // Estado para controlar la expansión de áreas
  const [errors, setErrors] = useState({});

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setNewArea('');
    setNewService({ areaId: '', nombre: '', unidad: '', rango: '', precio: '' });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (modalType === 'area') {
      setNewArea(value);
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleSave = () => {
    let currentErrors = {};
    if (modalType === 'area') {
      if (!newArea) {
        currentErrors.newArea = 'Este campo debe estar completo';
      }
    } else {
      if (!newService.areaId) currentErrors.areaId = 'Este campo debe estar completo';
      if (!newService.nombre) currentErrors.nombre = 'Este campo debe estar completo';
      if (!newService.unidad) currentErrors.unidad = 'Este campo debe estar completo';
      if (!newService.rango) currentErrors.rango = 'Este campo debe estar completo';
      if (!newService.precio) currentErrors.precio = 'Este campo debe estar completo';
    }
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      if (modalType === 'area') {
        // Guardar la nueva área (lógica adicional según sea necesario)
        setAreas([...areas, { id: areas.length + 1, name: newArea, servicios: [] }]);
      } else {
        // Guardar el nuevo servicio (lógica adicional según sea necesario)
        const updatedAreas = areas.map(area => {
          if (area.id === parseInt(newService.areaId)) {
            return { ...area, servicios: [...area.servicios, newService.nombre] };
          }
          return area;
        });
        setAreas(updatedAreas);
      }
      closeModal();
    }
  };

  const toggleArea = (areaId) => {
    setExpandedAreaId(expandedAreaId === areaId ? null : areaId);
  };

  return (
    <div className="p-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-indigo-500">Servicios</h1>
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => openModal('area')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Nueva Área</button>
        <button onClick={() => openModal('servicio')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Nuevo Servicio</button>
      </div>

      {areas.map(area => (
        <div key={area.id} className="mb-4">
          <div className="flex items-center space-x-4">
            <button
              className="flex-grow bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium text-left"
              onClick={() => toggleArea(area.id)}
            >
              {area.name}
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Editar</button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Eliminar</button>
          </div>
          {expandedAreaId === area.id && (
            <div className="mt-2 ml-4">
              {area.servicios.map((servicio, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <span className="flex-grow text-gray-700">{servicio}</span>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Editar</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            {modalType === 'area' ? (
              <>
                <h3 className="text-xl font-bold mb-4">Nueva Área</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nombre del Área</label>
                  <input
                    type="text"
                    name="newArea"
                    value={newArea}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  {errors.newArea && <p className="text-red-500 text-xs mt-1">{errors.newArea}</p>}
                </div>
                <div className="flex justify-center space-x-4">
                  <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
                  <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Guardar</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Nuevo Servicio</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Área</label>
                  <select
                    name="areaId"
                    value={newService.areaId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  >
                    <option value="">Seleccionar Área</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                  {errors.areaId && <p className="text-red-500 text-xs mt-1">{errors.areaId}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={newService.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Unidad</label>
                    <input
                      type="text"
                      name="unidad"
                      value={newService.unidad}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                    {errors.unidad && <p className="text-red-500 text-xs mt-1">{errors.unidad}</p>}
                  </div>
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">Rango</label>
                    <input
                      type="text"
                      name="rango"
                      value={newService.rango}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                    />
                    {errors.rango && <p className="text-red-500 text-xs mt-1">{errors.rango}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="text"
                    name="precio"
                    value={newService.precio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
                </div>
                <div className="flex justify-center space-x-4">
                  <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
                  <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Guardar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicios;
