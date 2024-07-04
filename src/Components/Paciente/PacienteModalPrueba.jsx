import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearPacienteModal = ({ isOpen, onClose, onSave, institutions, empresas, tiposPacientes, generos }) => {
  const initialFormValues  = {
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
  };
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requiredFields = [
        'cedulaIdentidad',
        'nombre',
        'primerApellido',
        'segundoApellido',
        'direccion',
        'numeroTelefono',
        'fechaNacimiento',
        'genero',
        'email',
        'dependencia',
        'tipoPaciente',
        'empresa'
      ];
      const allRequiredFieldsFilled = requiredFields.every(field => formValues[field].trim() !== '');
      setIsFormValid(allRequiredFieldsFilled);
    }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setError(null);
      setSuccess(false);
      setIsLoading(true);
      try {
        const newPatient = {
          ...formValues,
          dependencia: institutions.find(inst => inst.descripcion === formValues.dependencia),
          empresa: empresas.find(empr => empr.descripcion === formValues.empresa),
          tipoPaciente: tiposPacientes.find(tps => tps.descripcion === formValues.tipoPaciente),
        };
        await axios.post('http://10.16.1.41:8082/api/v1/paciente', newPatient);
        setSuccess(true);
        setIsLoading(false);
        onSave();
        setFormValues(initialFormValues);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } catch (error) {
        setError('Error creando paciente: ' + (error.response?.data?.message || error.message));
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
                  <textarea
      id="posibleDiagnostico"
      name="posibleDiagnostico"
      value={formValues.posibleDiagnostico}
      onChange={handleChange}
      rows="3"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-none"
    ></textarea>
                </div>
                <div>
                  <label htmlFor="medicacion" className="block text-sm font-medium text-gray-700">Medicación</label>
                  <textarea
      id="medicacion"
      name="medicacion"
      value={formValues.medicacion}
      onChange={handleChange}
      rows="3"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-none"
    ></textarea>
                </div>
                <div>
                  <label htmlFor="enfermedadCatastrofica" className="block text-sm font-medium text-gray-700">Enfermedades Catastróficas</label>
                  <textarea
      id="enfermedadCatastrofica"
      name="enfermedadCatastrofica"
      value={formValues.enfermedadCatastrofica}
      onChange={handleChange}
      rows="3"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none resize-none"
    ></textarea>
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
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Paciente creado con éxito!</p>}
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${
                isFormValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
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