import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pacientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState('');
  const [editInstitution, setEditInstitution] = useState({ id: '', descripcion: '' });
  const [formValues, setFormValues] = useState({
    cedulaIdentidad: '',
    nombre: '',
    direccion: '',
    numeroTelefono: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    posibleDiagnostico: '',
    medicacion: '',
    enfermedadCatastrofica: '',
    dependencia: ''
    
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [generos, setGeneros] = useState(['MASCULINO', 'FEMENINO', 'OTRO']);
  

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled);
  }, [formValues]);

  useEffect(() => {
    fetchInstitutions();
    fetchPacientes();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/dependencias');
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchPacientes = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/pacientes');
      setPacientes(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const newPatient = {
          ...formValues,
          dependencia: institutions.find(inst => inst.descripcion === formValues.dependencia)
        };
        await axios.post('http://10.16.1.41:8082/api/v1/paciente', newPatient);
        console.log('Nuevo Paciente Agregado:', newPatient);
        setIsModalOpen(false);
        fetchPacientes(); // Actualizar la lista de pacientes después de agregar uno nuevo
      } catch (error) {
        console.error('Error creando paciente:', error.response.data);
        // Manejar el error de acuerdo a tus necesidades, por ejemplo, mostrar un mensaje al usuario
      }
    }
  };

  const handleInstitutionSubmit = async (e) => {
    e.preventDefault();
    if (newInstitution.trim() !== '') {
      try {
        await axios.post('http://10.16.1.41:8082/api/v1/dependencia', { descripcion: newInstitution });
        console.log('Nueva Institución Agregada:', newInstitution);
        setIsInstitutionModalOpen(false);
        setNewInstitution('');
        fetchInstitutions(); // Actualizar la lista de instituciones después de agregar una nueva
      } catch (error) {
        console.error('Error creando institución:', error.response.data);
      }
    }
  };

  const handleEditInstitutionSubmit = async (e) => {
    e.preventDefault();
    if (editInstitution.descripcion.trim() !== '') {
      try {
        await axios.put('http://10.16.1.41:8082/api/v1/dependencia', editInstitution);
        console.log('Institución Editada:', editInstitution);
        setIsEditInstitutionModalOpen(false);
        fetchInstitutions(); // Actualizar la lista de instituciones después de editar una
      } catch (error) {
        console.error('Error editando institución:', error.response.data);
      }
    }
  };

  const openEditInstitutionModal = (institution) => {
    setEditInstitution(institution);
    setIsEditInstitutionModalOpen(true);
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Pacientes</h1>
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="buscar" className="block text-sm font-medium text-gray-700">Buscar</label>
        <input
          type="text"
          id="buscar"
          className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Buscar</button>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Nuevo Paciente</button>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Fecha de Nacimiento</th>
              <th className="px-4 py-2">Género</th>
              <th className="px-4 py-2">Correo Electrónico</th>
              <th className="px-4 py-2">Posible Diagnóstico</th>
              <th className="px-4 py-2">Medicación</th>
              <th className="px-4 py-2">Enfermedades Catastróficas</th>
              <th className="px-4 py-2">Cargo/Institución</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente, index) => (
              <tr key={index} >
                <td className="px-4 py-2">{paciente.cedulaIdentidad}</td>
                <td className="px-4 py-2">{paciente.nombre}</td>
                <td className="px-4 py-2">{paciente.direccion}</td>
                <td className="px-4 py-2">{paciente.numeroTelefono}</td>
                <td className="px-4 py-2">{paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString()  : 'N/A'}</td>
                <td className="px-4 py-2">{paciente.genero}</td>
                <td className="px-4 py-2">{paciente.email}</td>
                <td className="px-4 py-2">{paciente.posibleDiagnostico}</td>
                <td className="px-4 py-2">{paciente.medicacion}</td>
                <td className="px-4 py-2">{paciente.enfermedadCatastrofica}</td>
                <td className="px-4 py-2">{paciente.dependencia ? paciente.dependencia.descripcion : 'N/A'}</td>
                <td className="px-4 py-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">Editar</button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Gestión Cargo/Institución</label>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Cargo/Institución</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2">{institution.descripcion}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEditInstitutionModal(institution)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">Editar</button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <button onClick={() => setIsInstitutionModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Nueva Institución</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl h-4/5 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nuevo Paciente</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="cedulaIdentidad" className="block text-sm font-medium text-gray-700">Cédula de Identidad</label>
                  <input
                    type="text"
                    id="cedulaIdentidad"
                    name="cedulaIdentidad"
                    value={formValues.cedulaIdentidad}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formValues.direccion}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="numeroTelefono" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                  <input
                    type="text"
                    id="numeroTelefono"
                    name="numeroTelefono"
                    value={formValues.numeroTelefono}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formValues.fechaNacimiento}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="genero" className="block text-sm font-medium text-gray-700">Género</label>
                  <select
                    id="genero"
                    name="genero"
                    value={formValues.genero}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {generos.map((genero, index) => (
                      <option key={index} value={genero}>{genero}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="posibleDiagnostico" className="block text-sm font-medium text-gray-700">Posible Diagnóstico</label>
                  <input
                    type="text"
                    id="posibleDiagnostico"
                    name="posibleDiagnostico"
                    value={formValues.posibleDiagnostico}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="medicacion" className="block text-sm font-medium text-gray-700">Medicación</label>
                  <input
                    type="text"
                    id="medicacion"
                    name="medicacion"
                    value={formValues.medicacion}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="enfermedadCatastrofica" className="block text-sm font-medium text-gray-700">Enfermedades Catastróficas</label>
                  <input
                    type="text"
                    id="enfermedadCatastrofica"
                    name="enfermedadCatastrofica"
                    value={formValues.enfermedadCatastrofica}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="dependencia" className="block text-sm font-medium text-gray-700">Cargo/Institución</label>
                  <select
                    id="dependencia"
                    name="dependencia"
                    value={formValues.dependencia}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {institutions.map((inst, index) => (
                      <option key={index} value={inst.descripcion}>{inst.descripcion}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${
                    isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                  } text-white px-4 py-2 rounded-md`}
                  disabled={!isFormValid}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isInstitutionModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Nuevo Cargo/Institución</h2>
            <form onSubmit={handleInstitutionSubmit}>
              <div className="mb-4">
                <label htmlFor="newInstitution" className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  id="newInstitution"
                  value={newInstitution}
                  onChange={(e) => setNewInstitution(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={newInstitution.trim() === ''}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsInstitutionModalOpen(false)}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditInstitutionModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Cargo/Institución</h2>
            <form onSubmit={handleEditInstitutionSubmit}>
              <div className="mb-4">
                <label htmlFor="editInstitution" className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  id="editInstitution"
                  value={editInstitution.descripcion}
                  onChange={(e) => setEditInstitution({ ...editInstitution, descripcion: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={editInstitution.descripcion.trim() === ''}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditInstitutionModalOpen(false)}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;
