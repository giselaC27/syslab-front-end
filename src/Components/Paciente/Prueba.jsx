import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearPacienteModal from './CrearPacienteModal';
const Pacientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false);
  const [isEditEmpresaModalOpen, setIsEditEmpresaModalOpen] = useState(false);
  const [isEditTipoPacienteModalOpen, setIsEditTipoPacienteModalOpen] = useState(false);
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [isTipoPacienteModalOpen, setIsTipoPacienteModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [newInstitution, setNewInstitution] = useState({
    id: '',
    descripcion: '',
    codigoDependencia: '',
    activo: true, // Estado por defecto habilitado
  });
  const [editInstitution, setEditInstitution] = useState({ id: '', descripcion: '' ,  codigoDependencia: '',
    activo: true,});
  const [newEmpresa, setNewEmpresa] = useState({id: '',
    descripcion: '',
    codigoEmpresa: '',
    activo: true, });
  const [newTipoPaciente, setNewTipoPaciente] = useState({id: '',
    descripcion: '',
    codigoTipoPaciente: '',
    activo: true, });
  const [editEmpresa, setEditEmpresa] = useState({ id: '', descripcion: '', codigoEmpresa: '',
    activo: true,});
  const [editTipoPaciente, setEditTipoPaciente] = useState({ id: '', descripcion: '', codigoTipoPaciente: '',
    activo: true, });
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
  const [pacientes, setPacientes] = useState([]);
  const [generos, setGeneros] = useState(['MASCULINO', 'FEMENINO', 'OTRO']);
  const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);
const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(value => value.trim() !== '');
    setIsFormValid(allFieldsFilled);
  }, [formValues]);

  useEffect(() => {
    fetchInstitutions();
    fetchPacientes();
    fetchEmpresas();
    fetchTiposPaciente();
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

  const handleSavePaciente = () => {
    fetchPacientes();
  };

  const handleEditPatientSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);
  
    const patientToUpdate = {
      ...editingPatient,
      dependencia: institutions.find(inst => inst.descripcion === editingPatient.dependencia),
      empresa: empresas.find(emp => emp.descripcion === editingPatient.empresa),
      tipoPaciente: tiposPacientes.find(tp => tp.descripcion === editingPatient.tipoPaciente)
    };
  
    try {
      await axios.put('http://10.16.1.41:8082/api/v1/paciente', patientToUpdate);
      setSuccess(true);
      fetchPacientes();
      setTimeout(() => {
        setIsEditPatientModalOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError('Error editando paciente: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };
  const openEditPatientModal = (patient) => {
    setEditingPatient({
      ...patient,
      fechaNacimiento: patient.fechaNacimiento ? patient.fechaNacimiento.split('T')[0] : '',
      dependencia: patient.dependencia ? patient.dependencia.descripcion : '',
      empresa: patient.empresa ? patient.empresa.descripcion : '',
      tipoPaciente: patient.tipoPaciente ? patient.tipoPaciente.descripcion : ''
    });
    setIsEditPatientModalOpen(true);
  };

  const handleInstitutionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);
    
    if (newInstitution.descripcion.trim() !== '' && newInstitution.codigoDependencia.trim() !== '') {
      try {
        await axios.post('http://10.16.1.41:8082/api/v1/dependencia', newInstitution);
        setSuccess(true);
        setNewInstitution({ id: '', descripcion: '', codigoDependencia: '', activo: true });
        fetchInstitutions();
        setTimeout(() => {
          setIsInstitutionModalOpen(false);
          setSuccess(false);
          setIsLoading(false); 
        }, 2000);
      } catch (error) {
        setError('Error creando institución: ' + (error.response?.data?.message || error.message));
        setIsLoading(false); 
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Por favor, complete todos los campos requeridos.');
      setIsLoading(false);
    }
  };

  const handleEmpresaSubmit = async (e) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);
    e.preventDefault();
    if (newEmpresa.descripcion.trim() !== '' && newEmpresa.codigoEmpresa.trim() !== '') {
      try {
        await axios.post('http://10.16.1.41:8082/api/v1/empresa', newEmpresa);
        setSuccess(true);
        setNewEmpresa({ id: '', descripcion: '', codigoEmpresa: '', activo: true });
        fetchEmpresas();
        setTimeout(() => {
          setIsEmpresaModalOpen(false);
          setSuccess(false);
          setIsLoading(false); 
        }, 2000);
      } catch (error) {
        console.error('Error creando empresa:', error.response.data);
      }
    }
  };
  const handleTipoPacienteSubmit = async (e) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);
    e.preventDefault();
    if (newTipoPaciente.descripcion.trim() !== '' && newTipoPaciente.codigoTipoPaciente.trim() !== '') {
      try {
        await axios.post('http://10.16.1.41:8082/api/v1/tipo-paciente', newTipoPaciente);
        setSuccess(true);
        setNewTipoPaciente({ id: '', descripcion: '', codigoTipoPaciente: '', activo: true });
        fetchTiposPaciente();
        setTimeout(() => {
          setIsTipoPacienteModalOpen(false);
          setSuccess(false);
          setIsLoading(false); 
        }, 2000);// Actualizar la lista de tiposPaciente después de agregar uno nuevo
      } catch (error) {
        console.error('Error creando tipoPaciente:', error.response.data);
        setError('Error creando tipo de paciente: ' + (error.response?.data?.message || error.message));
        setIsLoading(false); 
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

//editar empresa 

const handleEditEmpresaSubmit = async (e) => {
  e.preventDefault();
  if (editEmpresa.descripcion.trim() !== '') {
    try {
      await axios.put('http://10.16.1.41:8082/api/v1/empresa', editEmpresa);
      console.log('Empresa editada:', editEmpresa);
      setIsEditEmpresaModalOpen(false);
      fetchEmpresas(); // Actualizar la lista de instituciones después de editar una
    } catch (error) {
      console.error('Error editando empresa:', error.response.data);
    }
  }
};

const openEditEmpresaModal = (empresa) => {
  setEditEmpresa(empresa);
  setIsEditEmpresaModalOpen(true);
};
//editar tipo paciente 

const handleEditTipoPacienteSubmit = async (e) => {
  e.preventDefault();
  if (editTipoPaciente.descripcion.trim() !== '') {
    try {
      await axios.put('http://10.16.1.41:8082/api/v1/tipo-paciente', editTipoPaciente);
      console.log('Tipo paciente:', editTipoPaciente);
      setIsEditTipoPacienteModalOpen(false);
      fetchTiposPaciente(); // Actualizar la lista de instituciones después de editar una
    } catch (error) {
      console.error('Error editando tipo paciente:', error.response.data);
    }
  }
};

const openEditTipoPacienteModal = (tipoPaciente) => {
  setEditTipoPaciente(tipoPaciente);
  setIsEditTipoPacienteModalOpen(true);
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
  <div className="max-h-96 overflow-y-auto">
    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Primer Apellido</th>
              <th className="px-4 py-2">Segundo Apellido</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Fecha de Nacimiento</th>
              <th className="px-4 py-2">Género</th>
              <th className="px-4 py-2">Correo Electrónico</th>
              <th className="px-4 py-2">Posible Diagnóstico</th>
              <th className="px-4 py-2">Medicación</th>
              <th className="px-4 py-2">Enfermedades Catastróficas</th>
              <th className="px-4 py-2">Cargo/Institución</th>
              <th className="px-4 py-2">Tipo Paciente</th>
              <th className="px-4 py-2">Empresa</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente, index) => (
              <tr key={index} >
                <td className="px-4 py-2">{paciente.cedulaIdentidad}</td>
                <td className="px-4 py-2">{paciente.nombre}</td>
                <td className="px-4 py-2">{paciente.primerApellido}</td>
                <td className="px-4 py-2">{paciente.segundoApellido}</td>
                <td className="px-4 py-2">{paciente.direccion}</td>
                <td className="px-4 py-2">{paciente.numeroTelefono}</td>
                <td className="px-4 py-2">{paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento).toLocaleDateString()  : 'N/A'}</td>
                <td className="px-4 py-2">{paciente.genero}</td>
                <td className="px-4 py-2">{paciente.email}</td>
                <td className="px-4 py-2">{paciente.posibleDiagnostico}</td>
                <td className="px-4 py-2">{paciente.medicacion}</td>
                <td className="px-4 py-2">{paciente.enfermedadCatastrofica}</td>
                <td className="px-4 py-2">{paciente.dependencia ? paciente.dependencia.descripcion : 'N/A'}</td>
                <td className="px-4 py-2">{paciente.empresa ? paciente.empresa.descripcion : 'N/A'}</td>
                <td className="px-4 py-2">{paciente.tipoPaciente ? paciente.tipoPaciente.descripcion: 'N/A'}</td>
                <td className="px-4 py-2">
                  <button 
  onClick={() => openEditPatientModal(paciente)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium"
>
  Editar
</button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="text-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Gestión Cargo/Institución</label>
      </div>

      <div className="overflow-x-auto mb-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <div className="max-h-96 overflow-y-auto mb-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Cargo/Institución</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2">{institution.descripcion}</td>
                <td className="px-4 py-2">{institution.activo ? 'Activo' : 'Inactivo'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openEditInstitutionModal(institution)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button
          onClick={() => setIsInstitutionModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nueva Institución
        </button>
      </div>
    </div>

    <div>
      <div className="max-h-96 overflow-y-auto mb-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Empresas</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <td className="px-4 py-2">{empresa.descripcion}</td>
                <td className="px-4 py-2">{empresa.activo ? 'Activo' : 'Inactivo'}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openEditEmpresaModal(empresa)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium"
                  >
                    Editar
                  </button>
                  <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button
          onClick={() => setIsEmpresaModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Nueva Empresa
        </button>
      </div>
    </div>
  </div>
</div>

<div className="text-center mb-4">
  <label className="block text-sm font-medium text-gray-700">
    Gestión Tipo Pacientes
  </label>
</div>
<div>
<div className="max-h-96 overflow-y-auto mb-4">
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
    <thead className="bg-indigo-500 text-white">
      <tr>
        <th className="px-4 py-2">Tipos Pacientes</th>
        <th className="px-4 py-2">Estado</th>
        <th className="px-4 py-2">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {tiposPacientes.map((tipoPaciente, index) => (
        <tr key={index} className="bg-white border-b border-gray-200">
          <td className="px-4 py-2">{tipoPaciente.descripcion}</td>
          <td className="px-4 py-2">{tipoPaciente.activo ? 'Activo' : 'Inactivo'}</td>
          <td className="px-4 py-2">
            <button
              onClick={() => openEditTipoPacienteModal(tipoPaciente)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md text-xs font-medium"
            >
              Editar
            </button>
            <button className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
  <div className="text-center mt-4">
    <button
      onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Nuevo Paciente
    </button>
  </div>
</div>


<CrearPacienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePaciente}
        institutions={institutions}
        empresas={empresas}
        tiposPacientes={tiposPacientes}
        generos={generos}
      />

{isEditPatientModalOpen  && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl h-4/5 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Paciente</h2>
            <form onSubmit={handleEditPatientSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="cedulaIdentidadEditar" className="block text-sm font-medium text-gray-700">Cédula de Identidad</label>
                  <input
                    type="text"
                    id="cedulaIdentidadEditar"
                    name="cedulaIdentidadEditar"
                    value={editingPatient.cedulaIdentidad}
                    onChange={(e) => setEditingPatient({...editingPatient, cedulaIdentidad: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="nombreEditar" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="nombreEditar"
                    name="nombreEditar"
                    value={editingPatient.nombre}
                    onChange={(e) => setEditingPatient({...editingPatient, nombre: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="primerApellidoEditar" className="block text-sm font-medium text-gray-700">Primer Apellido</label>
                  <input
                    type="text"
                    id="primerApellidoEditar"
                    name="primerApellidoEditar"
                    value={editingPatient.primerApellido}
                    onChange={(e) => setEditingPatient({...editingPatient, primerApellido: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="segundoApellidoEditar" className="block text-sm font-medium text-gray-700">Segundo Apellido</label>
                  <input
                    type="text"
                    id="segundoApellidoEditar"
                    name="segundoApellidoEditar"
                    value={editingPatient.segundoApellido}
                    onChange={(e) => setEditingPatient({...editingPatient, segundoApellido: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="direccionEditar" className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    id="direccionEditar"
                    name="direccionEditar"
                    value={editingPatient.direccion}
                    onChange={(e) => setEditingPatient({...editingPatient, direccion: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="numeroTelefonoEditar" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                  <input
                    type="text"
                    id="numeroTelefonoEditar"
                    name="numeroTelefonoEditar"
                    value={editingPatient.numeroTelefono}
                    onChange={(e) => setEditingPatient({...editingPatient, numeroTelefono: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="fechaNacimientoEditar" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fechaNacimientoEditar"
                    name="fechaNacimientoEditar"
                    value={editingPatient.fechaNacimiento}
                    onChange={(e) => setEditingPatient({...editingPatient, fechaNacimiento: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="generoEditar" className="block text-sm font-medium text-gray-700">Género</label>
                  <select
                    id="generoEditar"
                    name="generoEditar"
                    value={editingPatient.genero}
                    onChange={(e) => setEditingPatient({...editingPatient, genero: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {generos.map((genero, index) => (
                      <option key={index} value={genero}>{genero}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="emailEditar" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="emailEditar"
                    id="emailEditar"
                    name="emailEditar"
                    value={editingPatient.email}
                    onChange={(e) => setEditingPatient({...editingPatient, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="posibleDiagnosticoEditar" className="block text-sm font-medium text-gray-700">Posible Diagnóstico</label>
                  <input
                    type="text"
                    id="posibleDiagnosticoEditar"
                    name="posibleDiagnosticoEditar"
                    value={editingPatient.posibleDiagnostico}
                    onChange={(e) => setEditingPatient({...editingPatient, posibleDiagnostico: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="medicacionEditar" className="block text-sm font-medium text-gray-700">Medicación</label>
                  <input
                    type="text"
                    id="medicacionEditar"
                    name="medicacionEditar"
                    value={editingPatient.medicacion}
                    onChange={(e) => setEditingPatient({...editingPatient, medicacion: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="enfermedadCatastroficaEditar" className="block text-sm font-medium text-gray-700">Enfermedades Catastróficas</label>
                  <input
                    type="text"
                    id="enfermedadCatastroficaEditar"
                    name="enfermedadCatastroficaEditar"
                    value={editingPatient.enfermedadCatastrofica}
                    onChange={(e) => setEditingPatient({...editingPatient, enfermedadCatastrofica: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="dependenciaEditar" className="block text-sm font-medium text-gray-700">Cargo/Institución</label>
                  <select
                    id="dependenciaEditar"
                    name="dependenciaEditar"
                    value={editingPatient.dependencia}
                    onChange={(e) => setEditingPatient({...editingPatient, dependencia: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {institutions.map((inst, index) => (
                      <option key={index} value={inst.descripcion}>{inst.descripcion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="empresaEditar" className="block text-sm font-medium text-gray-700">Empresa</label>
                  <select
                    id="empresaEditar"
                    name="empresaEditar"
                    value={editingPatient.empresa}
                    onChange={(e) => setEditingPatient({...editingPatient, empresa: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  >
                    <option value="">Seleccionar</option>
                    {empresas.map((empr, index) => (
                      <option key={index} value={empr.descripcion}>{empr.descripcion}</option>
                    ))}
                  </select>
                </div>
                <div>
                  
                  <label htmlFor="tipoPacienteEditar" className="block text-sm font-medium text-gray-700">Tipo Paciente</label>
                  <select
                    id="tipoPacienteEditar"
                    name="tipoPacienteEditar"
                    value={editingPatient.tipoPaciente}
                    onChange={(e) => setEditingPatient({...editingPatient, tipoPaciente: e.target.value})}
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
        {success && <p className="text-green-500 text-sm mt-2">Paciente editado con éxito!</p>}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsEditPatientModalOpen(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
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
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="descripcion"
            value={newInstitution.descripcion}
            onChange={(e) => setNewInstitution({ ...newInstitution, descripcion: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="codigoDependencia" className="block text-sm font-medium text-gray-700">Código Dependencia</label>
          <input
            type="text"
            id="codigoDependencia"
            value={newInstitution.codigoDependencia}
            onChange={(e) => setNewInstitution({ ...newInstitution, codigoDependencia: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Institución creada con éxito!</p>}
        <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={!newInstitution.descripcion.trim() || !newInstitution.codigoDependencia.trim() || isLoading}
  >
    {isLoading ? 'Guardando...' : 'Guardar'}
  </button>
  
  <button
    type="button"
    onClick={() => setIsInstitutionModalOpen(false)}
    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={isLoading}
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
          <label htmlFor="editDescripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            id="editDescripcion"
            value={editInstitution.descripcion}
            onChange={(e) => setEditInstitution({ ...editInstitution, descripcion: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editCodigoDependencia" className="block text-sm font-medium text-gray-700">Código Dependencia</label>
          <input
            type="text"
            id="editCodigoDependencia"
            value={editInstitution.codigoDependencia}
            onChange={(e) => setEditInstitution({ ...editInstitution, codigoDependencia: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editActivo" className="flex items-center">
            <input
              type="checkbox"
              id="editActivo"
              checked={editInstitution.activo}
              onChange={(e) => setEditInstitution({ ...editInstitution, activo: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
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

{isEmpresaModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Nueva empresa </h2>
          <form onSubmit={handleEmpresaSubmit}>
            <div className="mb-4">
              <label htmlFor="newEmpresa" className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                id="newEmpresa"
                value={newEmpresa.descripcion}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, descripcion: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
          <label htmlFor="codigoEmpresa" className="block text-sm font-medium text-gray-700">Código Empresa</label>
          <input
            type="text"
            id="codigoEmpresa"
            value={newEmpresa.codigoEmpresa}
            onChange={(e) => setNewEmpresa({ ...newEmpresa, codigoEmpresa: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Empresa creada con éxito!</p>}

        <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={!newEmpresa.descripcion.trim() || !newEmpresa.codigoEmpresa.trim() || isLoading}
  >
    {isLoading ? 'Guardando...' : 'Guardar'}
  </button>
  
  <button
    type="button"
    onClick={() => setIsEmpresaModalOpen(false)}
    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={isLoading}
  >
    Cancelar
  </button>
      </form>

        </div>
      </div>
      )}
      {isEditEmpresaModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Editar empresa</h2>
            <form onSubmit={handleEditEmpresaSubmit}>
              <div className="mb-4">
                <label htmlFor="editEmpresa" className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  id="editEmpresa"
                  value={editEmpresa.descripcion}
                  onChange={(e) => setEditEmpresa({ ...editEmpresa, descripcion: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
          <label htmlFor="editCodigoEmpresa" className="block text-sm font-medium text-gray-700">Código Empresa</label>
          <input
            type="text"
            id="editCodigoEmpresa"
            value={editEmpresa.codigoEmpresa}
            onChange={(e) => setEditEmpresa({ ...editEmpresa, codigoEmpresa: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editActivoEmpresa" className="flex items-center">
            <input
              type="checkbox"
              id="editActivoEmpresa"
              checked={editEmpresa.activo}
              onChange={(e) => setEditEmpresa({ ...editEmpresa, activo: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
        </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={editEmpresa.descripcion.trim() === ''}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditEmpresaModalOpen(false)}
                className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {isTipoPacienteModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Nueva Tipo Paciente </h2>
          <form onSubmit={handleTipoPacienteSubmit}>
            <div className="mb-4">
              <label htmlFor="newTipoPaciente" className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                id="newTipoPaciente"
                value={newTipoPaciente.descripcion}
                onChange={(e) => setNewTipoPaciente({ ...newTipoPaciente, descripcion: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
          <label htmlFor="codigoTipoPaciente" className="block text-sm font-medium text-gray-700">Código Tipo Paciente</label>
          <input
            type="text"
            id="codigoTipoPaciente"
            value={newTipoPaciente.codigoTipoPaciente}
            onChange={(e) => setNewTipoPaciente({ ...newTipoPaciente, codigoTipoPaciente: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Tipo Paciente creado con éxito!</p>}
        <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={!newTipoPaciente.descripcion.trim() || !newTipoPaciente.codigoTipoPaciente.trim() || isLoading}
  >
    {isLoading ? 'Guardando...' : 'Guardar'}
  </button>
  
  <button
    type="button"
    onClick={() => setIsTipoPacienteModalOpen(false)}
    className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    disabled={isLoading}
  >
    Cancelar
  </button>

          </form>
        </div>
      </div>
      )}
      {isEditTipoPacienteModalOpen && (
        <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Editar Tipo Paciente</h2>
            <form onSubmit={handleEditTipoPacienteSubmit}>
              <div className="mb-4">
                <label htmlFor="editTipoPaciente" className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  id="editTipoPaciente"
                  value={editTipoPaciente.descripcion}
                  onChange={(e) => setEditTipoPaciente({ ...editTipoPaciente, descripcion: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
          <label htmlFor="editCodigoTipoPaciente" className="block text-sm font-medium text-gray-700">Código Tipo Paciente </label>
          <input
            type="text"
            id="editCodigoTipoPaciente"
            value={editTipoPaciente.codigoTipoPaciente}
            onChange={(e) => setEditTipoPaciente({ ...editTipoPaciente, codigoTipoPaciente: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="editActivoTipoPaciente" className="flex items-center">
            <input
              type="checkbox"
              id="editActivoTipoPaciente"
              checked={editTipoPaciente.activo}
              onChange={(e) => setEditTipoPaciente({ ...editTipoPaciente, activo: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
        </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={editTipoPaciente.descripcion.trim() === ''}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditTipoPacienteModalOpen(false)}
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