import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pacientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState('');
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
        console.error('Error creating institution:', error.response.data);
      }
    }
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
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium">Editar</button>
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
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl h-4/5 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nuevo Paciente</h2>
            <form onSubmit={handleSubmit}>
              {Object.keys(formValues).map((key) => (
                <div className="mb-4" key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {key === 'dependencia' ? (
                    <select
                      id={key}
                      name={key}
                      value={formValues[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Seleccione una institución</option>
                      {institutions.map((institution, index) => (
                        <option key={index} value={institution.descripcion}>
                          {institution.descripcion}
                        </option>
                      ))}
                    </select>
                  ) : key === 'genero' ? (
                    <select
                      id={key}
                      name={key}
                      value={formValues[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Seleccione un género</option>
                      {generos.map((genero, index) => (
                        <option key={index} value={genero}>
                          {genero}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={formValues[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  )}
                  
                </div>
              ))}
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={!isFormValid}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
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
    </div>
  );
};

export default Pacientes;

