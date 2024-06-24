import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearPacienteModal = ({ isOpen, onClose, onPatientCreated }) => {
  const [formValues, setFormValues] = useState({
    cedulaIdentidad: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    direccion: '',
    numeroTelefono: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    posibleDiagnostico: '',
    medicacion: '',
    enfermedadCatastrofica: '',
    dependencia: '',
    tipoPaciente: '',
    empresa: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [tiposPacientes, setTiposPaciente] = useState([]);
  const [generos] = useState(['MASCULINO', 'FEMENINO', 'OTRO']);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInstitutions();
      fetchEmpresas();
      fetchTiposPaciente();
    }
  }, [isOpen]);

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled);
  }, [formValues]);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/dependencias');
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchEmpresas = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const fetchTiposPaciente = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/tipos-paciente');
      setTiposPaciente(response.data);
    } catch (error) {
      console.error('Error fetching tiposPaciente:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const newPatient = {
          ...formValues,
          dependencia: institutions.find(inst => inst.descripcion === formValues.dependencia),
          empresa: empresas.find(empr => empr.descripcion === formValues.empresa),
          tipoPaciente: tiposPacientes.find(tps => tps.descripcion === formValues.tipoPaciente),
        };
        const response = await axios.post('http://10.16.1.41:8082/api/v1/paciente', newPatient);
        console.log('Nuevo Paciente Agregado:', response.data);
        setSuccess(true);
        onPatientCreated(response.data);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000); // Cierra el modal después de 2 segundos
      } catch (error) {
        console.error('Error creando paciente:', error.response?.data);
        setError('Error al crear el paciente. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;


  return (
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
                  <label htmlFor="primerApellido" className="block text-sm font-medium text-gray-700">Primer Apellido</label>
                  <input
                    type="text"
                    id="primerApellido"
                    name="primerApellido"
                    value={formValues.primerApellido}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="segundoApellido" className="block text-sm font-medium text-gray-700">Segundo Apellido</label>
                  <input
                    type="text"
                    id="segundoApellido"
                    name="segundoApellido"
                    value={formValues.segundoApellido}
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
                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
                  <select
                    id="empresa"
                    name="empresa"
                    value={formValues.empresa}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {empresas.map((empr, index) => (
                      <option key={index} value={empr.descripcion}>{empr.descripcion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  
                  <label htmlFor="tipoPaciente" className="block text-sm font-medium text-gray-700">Tipo Paciente</label>
                  <select
                    id="tipoPaciente"
                    name="tipoPaciente"
                    value={formValues.tipoPaciente}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {tiposPacientes.map((tps, index) => (
                      <option key={index} value={tps.descripcion}>{tps.descripcion}</option>
                    ))}
                  </select>
                </div>
              </div>
              {error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              Paciente creado con éxito!
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${
                isFormValid && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white px-4 py-2 rounded-md`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearPacienteModal;