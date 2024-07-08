import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Servicios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [areas, setAreas] = useState([]);
  const [newArea, setNewArea] = useState('');
  const [newService, setNewService] = useState({ areaId: '', codigoServicio: '', nombre: '', precio: '', estaActivo: true });
  const [expandedAreaId, setExpandedAreaId] = useState(null);
  const [errors, setErrors] = useState({});
  const [editingArea, setEditingArea] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAreasAndServices();
  }, []);

  const fetchAreasAndServices = async () => {
    try {
      const areasResponse = await axios.get('http://10.16.1.41:8082/api/v1/areas');
      const serviciosResponse = await axios.get('http://10.16.1.41:8082/api/v1/servicios');
      
      const areasWithServices = areasResponse.data.map(area => ({
        ...area,
        servicios: serviciosResponse.data.filter(servicio => servicio.area.idArea === area.idArea)
      }));
      setAreas(areasWithServices);
    } catch (error) {
      console.error('Error fetching areas and services:', error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setNewArea('');
    setNewService({ areaId: '', codigoServicio: '', nombre: '', precio: '', estaActivo: true });
    setErrors({});
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (modalType === 'area') {
      setNewArea(value);
    } else {
      setNewService({ 
        ...newService, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  const handleSave = async () => {
    let currentErrors = {};
    setIsLoading(true);
    setError(null);
    setSuccess(false);
  
    if (modalType === 'editArea') {
      await handleUpdateArea();
    } else if (modalType === 'editService') {
      await handleUpdateService();
    } else if (modalType === 'area') {
      if (!newArea) {
        currentErrors.newArea = 'Este campo debe estar completo';
      }
      if (Object.keys(currentErrors).length === 0) {
        try {
          await axios.post('http://10.16.1.41:8082/api/v1/area', { nombreArea: newArea });
          await fetchAreasAndServices();
          setSuccess(true);
          setTimeout(() => {
            closeModal();
            setSuccess(false);
          }, 2000);
        } catch (error) {
          console.error('Error saving new area:', error);
          setError('Ocurrió un error al guardar el área. Por favor, inténtalo de nuevo.');
        }
      }
    } else if (modalType === 'servicio') {
      if (!newService.areaId) currentErrors.areaId = 'Este campo debe estar completo';
      if (!newService.codigoServicio) currentErrors.codigoServicio = 'Este campo debe estar completo';
      if (!newService.nombre) currentErrors.nombre = 'Este campo debe estar completo';
      if (!newService.precio) currentErrors.precio = 'Este campo debe estar completo';
  
      if (Object.keys(currentErrors).length === 0) {
        try {
          const servicioData = {
            codigoServicio: newService.codigoServicio,
            nombreServicio: newService.nombre,
            precio: parseFloat(newService.precio),
            estaActivo: newService.estaActivo,
            area: { idArea: parseInt(newService.areaId) }
          };
          await axios.post('http://10.16.1.41:8082/api/v1/servicio', servicioData);
          await fetchAreasAndServices();
          setSuccess(true);
          setTimeout(() => {
            closeModal();
            setSuccess(false);
          }, 2000);
        } catch (error) {
          console.error('Error saving new service:', error);
          setError('Ocurrió un error al guardar el servicio. Por favor, inténtalo de nuevo.');
        }
      }
    }
  
    setIsLoading(false);
    setErrors(currentErrors);
  };

  const toggleArea = (areaId) => {
    setExpandedAreaId(expandedAreaId === areaId ? null : areaId);
  };

  const handleEditArea = (area) => {
    setEditingArea(area);
    setNewArea(area.nombreArea);
    openModal('editArea');
  };
  
  const handleEditService = (service) => {
    setEditingService(service);
    setNewService({
      areaId: service.area.idArea,
      codigoServicio: service.codigoServicio,
      nombre: service.nombreServicio,
      precio: service.precio.toString(),
      estaActivo: service.estaActivo
    });
    openModal('editService');
  };
  
  const handleUpdateArea = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!newArea) {
      setErrors({ newArea: 'Este campo debe estar completo' });
      setIsLoading(false);
      return;
    }
    try {
      await axios.put('http://10.16.1.41:8082/api/v1/area', {
        idArea: editingArea.idArea,
        nombreArea: newArea
      });
      await fetchAreasAndServices();
      setSuccess(true);
      setTimeout(() => {
        closeModal();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating area:', error);
      setError('Ocurrió un error al actualizar el área. Por favor, inténtalo de nuevo.');
    }

    setIsLoading(false);
  };
  
  const handleUpdateService = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    let currentErrors = {};
    if (!newService.areaId) currentErrors.areaId = 'Este campo debe estar completo';
    if (!newService.codigoServicio) currentErrors.codigoServicio = 'Este campo debe estar completo';
    if (!newService.nombre) currentErrors.nombre = 'Este campo debe estar completo';
    if (!newService.precio) currentErrors.precio = 'Este campo debe estar completo';
    setErrors(currentErrors);
  
    if (Object.keys(currentErrors).length === 0) {
      try {
        const servicioData = {
          idServicios: editingService.idServicios,
          codigoServicio: newService.codigoServicio,
          nombreServicio: newService.nombre,
          precio: parseFloat(newService.precio),
          estaActivo: newService.estaActivo,
          area: { idArea: parseInt(newService.areaId) }
        };
        await axios.put('http://10.16.1.41:8082/api/v1/servicio', servicioData);
        await fetchAreasAndServices();
        setSuccess(true);
        setTimeout(() => {
          closeModal();
          setSuccess(false);
        }, 2000);
      } catch (error) {
        console.error('Error updating service:', error);
        setError('Ocurrió un error al actualizar el servicio. Por favor, inténtalo de nuevo.');
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Servicios</h1>
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => openModal('area')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Nueva Área</button>
        <button onClick={() => openModal('servicio')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Nuevo Servicio</button>
      </div>

      {areas.map(area => (
        <div key={area.idArea} className="mb-4">
          <div className="flex items-center space-x-4">
            <button
              className="flex-grow bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium text-left"
              onClick={() => toggleArea(area.idArea)}
            >
              {area.nombreArea}
            </button>
            <button onClick={() => handleEditArea(area)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Editar</button>
          </div>
          {expandedAreaId === area.idArea && (
            <div className="mt-2 ml-4">
              {area.servicios.map(servicio => (
                <div key={servicio.idServicios} className="flex items-center space-x-4 mb-2">
                  <span className="flex-grow text-gray-700">
                    Nombre: {servicio.nombreServicio} - Precio: $ {servicio.precio} - Código: {servicio.codigoServicio}
                    {servicio.estaActivo ? ' - Activo' : ' - Inactivo'}
                  </span>
                  <button onClick={() => handleEditService(servicio)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Editar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            {(modalType === 'area' || modalType === 'editArea') ? (
              <>
                <h3 className="text-xl font-bold mb-4">{modalType === 'area' ? 'Nueva Área' : 'Editar Área'}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Nombre del Área</label>
                  <input
                    type="text"
                    name="newArea"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  {errors.newArea && <p className="text-red-500 text-xs mt-1">{errors.newArea}</p>}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">{modalType === 'servicio' ? 'Nuevo Servicio' : 'Editar Servicio'}</h3>
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
                      <option key={area.idArea} value={area.idArea}>{area.nombreArea}</option>
                    ))}
                  </select>
                  {errors.areaId && <p className="text-red-500 text-xs mt-1">{errors.areaId}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Código de Servicio</label>
                  <input
                    type="text"
                    name="codigoServicio"
                    value={newService.codigoServicio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  {errors.codigoServicio && <p className="text-red-500 text-xs mt-1">{errors.codigoServicio}</p>}
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
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="estaActivo"
                      checked={newService.estaActivo}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Activo</span>
                  </label>
                </div>
              </>
            )}
            
            {isLoading && <p className="text-blue-500">Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">Operación exitosa</p>}
            <div className="flex justify-center space-x-4">
              <button 
                onClick={closeModal} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={isLoading}
              >
               {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Servicios;