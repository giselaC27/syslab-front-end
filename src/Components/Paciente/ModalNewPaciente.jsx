import React, { useState, useEffect } from 'react';

const NuevoPacienteModal = ({ isOpen, onClose, onSubmit, paciente}) => {
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
  const [generos, setGeneros] = useState(['MASCULINO', 'FEMENINO', 'OTRO']);
  const [institutions, setInstitutions] = useState([]);
  const [newPaciente, setNewPaciente]= useState({})
  if (paciente !== null){
    setNewPaciente(paciente)
  }

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled);
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const closeModal = () => {
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const newPatient = {
        ...formValues,
        dependencia: institutions.find(inst => inst.descripcion === formValues.dependencia)
      };
      onSubmit(newPatient);
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
                  disabled={!isFormValid}
                >
                  Guardar
                </button>
              </div>

        
        </form>
      </div>
    </div>
  );
};

export default NuevoPacienteModal;


      
