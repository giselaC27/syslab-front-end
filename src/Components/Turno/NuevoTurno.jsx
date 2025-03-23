import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import AddServiceModal from './AddServiceModal';
import axios from 'axios';
import CrearPacienteModal from '../Paciente/CrearPacienteModal';
import { endPoint } from '../EndPoint';
const NuevoTurno = () => {
  const [isModaladdServiceOpen, setIsModaladdServiceOpen] = useState(false);
  const [ciPaciente, setCiPaciente] = useState('');
  const [pacienteTurno, setPacienteTurno] = useState(null);
  const [existPaciente, setExistPaciente] = useState(null);
  const [serviciosTurno, setServiciosTurno] = useState([]);
  const [isModalPacienteOpen, setIsModalPacienteOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [idTurno, setIdTurno] = useState(0);
  const [generos, setGeneros] = useState(['MASCULINO', 'FEMENINO', 'OTRO']);
  const { user, setUser } = useContext(AuthContext);
  const [descuento, setDescuento] = useState(0);
  const [enableDescuentos, setEnableDescuentos] = useState(false);



  // listas para la info de paciente:
  const [institutions, setInstitutions] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [tiposPacientes, setTiposPaciente] = useState([]);

  // metodos para obtener datos para un nuevo paciente
  const fetchInstitutions = async () => {
    try {
      const response = await axios.get(endPoint + '/api/v1/dependencias');
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const handleSavePaciente = async () => {
    let paciente = await getPacienteForTurno(ciPaciente);
    // si el paciente no existe se pregunta si se desea registrar
    if (!paciente) {
      setPacienteTurno(null);
      const register = window.confirm('El paciente con: ' + ciPaciente + ' no está registrado. Revisa la información nuevamente o ¿Deseas registrar al paciente?');
      if (register) {
        setExistPaciente(null);
        handleAddNewPaciente();
      }
      return;
    }
    // si el paciente esta registrado se asigna para el turno
    setPacienteTurno(paciente);
  };


  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(endPoint + '/api/v1/empresas');
      setEmpresas(response.data);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const fetchTiposPaciente = async () => {
    try {
      const response = await axios.get(endPoint + '/api/v1/tipos-paciente');
      setTiposPaciente(response.data);
    } catch (error) {
      console.error('Error fetching tiposPaciente:', error);
    }
  };

  const handleAddNewPaciente = () => {
    fetchEmpresas();
    fetchTiposPaciente();
    fetchInstitutions();
    setIsModalPacienteOpen(true);

  };

  // Función para limpiar los parámetros de la pantalla
  const clearState = () => {
    setCiPaciente('');
    setPacienteTurno(null);
    setExistPaciente(null);
    setServiciosTurno([]);
    setTotalCost(0);
    setIdTurno(0);
    setDescuento(0);
    setEnableDescuentos(false);
  };



  // método para añadir un servicio desde el modal addServiceModal
  const handleAddService = (service, quantity) => {
    quantity = parseInt(quantity);

    setServiciosTurno(prevServiciosTurno => {

      const existingServiceIndex = prevServiciosTurno.findIndex(item => item.servicio.idServicios === service.idServicios);

      const roundToTwoDecimals = (number) => parseFloat(number.toFixed(2));

      if (existingServiceIndex !== -1) {
        const updatedServiciosTurno = [...prevServiciosTurno];
        updatedServiciosTurno[existingServiceIndex].cantidad = quantity; // Actualiza solo la cantidad
        updatedServiciosTurno[existingServiceIndex].total = roundToTwoDecimals((service.precio * quantity)); // Recalcula el total

        handleCalculateTotalCost(updatedServiciosTurno); // Recalcula el total general
        return updatedServiciosTurno;
      } else {
        const newServicioTurno = {
          cantidad: quantity,
          servicio: service,
          total: roundToTwoDecimals((service.precio * quantity)),
        };
        const updatedServiciosTurno = [...prevServiciosTurno, newServicioTurno];
        handleCalculateTotalCost(updatedServiciosTurno); // Recalcula el total general
        return updatedServiciosTurno;
      }
    });
  };

  const handleDeleteServiceOfServices = (service) => {
    setServiciosTurno(prevServiciosTurno => {
      const updatedServiciosTurno = prevServiciosTurno.filter(item => item !== service);
      handleCalculateTotalCost(updatedServiciosTurno); // Recalcula el total general
      return updatedServiciosTurno;
    });
  };



  // Función para recalcular el costo total de todos los servicios
  const handleCalculateTotalCost = (serviciosTurno) => {
    let totalCostLocal = 0;
    for (let servicioTurno of serviciosTurno) {
      totalCostLocal += servicioTurno.total;
    }
    if (descuento > 0) {
      let TotalCostLocalWithDescuento = totalCostLocal * (1 - (descuento / 100));
      setTotalCost(TotalCostLocalWithDescuento);
    } else {
      setTotalCost(totalCostLocal);
    }

  };

  // Función para recalcular el costo total de todos los servicios agregado el descuento
  const handleCalculateTotalCostWithDescuento = (descuento) => {
    let totalCostLocal = 0;
    for (let servicioTurno of serviciosTurno) {
      totalCostLocal += servicioTurno.total;
    }
    let TotalCostLocalWithDescuento = totalCostLocal * (1 - (descuento / 100));
    setTotalCost(TotalCostLocalWithDescuento);
  };


  const getPacienteForTurno = async (ci) => {
    try {
      const response = await axios.get(endPoint + '/api/v1/paciente/ci/' + ci.toString());
      if (response.status === 200) {
        // si el servidor responde correctamente se verifica que el resultado no sea vacio
        if (response.data == "") {
          return null;
        } else {
          return response.data;
        }
      }
    } catch (error) {
      alert('ERROR: ' + error.response.data);
    }

  };

  const getProformaByPaciente = async (ci) => {
    try {
      const response = await axios.get(endPoint + '/api/v1/proforma/ci/' + ci.toString());
      if (response.status === 200) {
        // si el servidor responde correctamente se verifica que el resultado no sea vacio
        if (response.data == "") {
          return null;
        } else {
          return response.data;
        }
      }
    } catch (error) {
      alert('ERROR: ' + error.response.data);
    }

  };

  // metodo para crear un nuevo turno
  const handlerCreateNewTurno = async () => {
    if (pacienteTurno === null) {
      alert("Debe colocar la cédula de un paciente registrado anteriormente.");
      return;
    }

    if (serviciosTurno.length === 0) {
      alert("Agrega al menos un servicio para proformar");
      return;
    }
    if (!pacienteTurno.estaRegistrado) {
      const confirmNewTurno = window.confirm('El paciente con CI:  ' + pacienteTurno.cedulaIdentidad + ' no está registrado completamente.¿Deseas registrar al paciente para agendar el nuevo TURNO?');
      if (confirmNewTurno) {
        setExistPaciente(pacienteTurno)
        handleAddNewPaciente();
      }
      return;
    }

    const turno = {
      idTurno: idTurno,
      paciente: { cedulaIdentidad: ciPaciente },
      estado: "PENDIENTE",
      total: totalCost,
      servicios: serviciosTurno,
      usuario: {
        idUsuario: user.idUsuario
      },
      descuento: descuento
    };

    const newProforma = window.confirm("¿Deseas crear un nuevo TURNO?");
    if (!newProforma) {
      alert("TURNO NO GENERADO");
      return;
    }

    try {
      await axios.post(endPoint + '/api/v1/turno', turno);
      alert('TURNO GENERADO CORRECTAMENTE');
      clearState();
    } catch (error) {
      console.error('Error creando institución:', turno);
    }
  };


  // metodo para obtener la informacion del paciente que va a registrar un nuevo turno  
  const handleCiPacienteChange = async (event) => {
    setCiPaciente(event.target.value);
    if (event.target.value.length < 10) {
      setPacienteTurno(null);
      return;
    }
    if (event.target.value.length === 10) {

      let paciente = await getPacienteForTurno(event.target.value);

      // si el paciente no existe se pregunta si se desea registrar
      if (!paciente) {

        setPacienteTurno(null);
        const register = window.confirm('El paciente con: ' + event.target.value + ' no está registrado. Revisa la información nuevamente o ¿Deseas registrar al paciente?');
        if (register) {
          setExistPaciente(null);
          handleAddNewPaciente();
        }
        return;
      }

      // si el paciente esta registrado se asigna para el turno
      setPacienteTurno(paciente);



      //se procede a inspeccionar si el paciente no tiene proformas pendientes
      let proforma = await getProformaByPaciente(event.target.value);

      if (!proforma) {
        return;
      }
      const showProforma = window.confirm('El paciente cuenta con una proforma pendiente.¿Deseas recuperarla?');
      // se rellena la informacion con la de la proforma

      if (showProforma) {

        for (let servicio of proforma.servicios) {
          handleAddService(servicio.servicio, servicio.cantidad);
        }

        setIdTurno(proforma.idTurno);
      }

    }
  };

  //metodo para borrar todos los servicios cotizados
  const handleDeleteBotton = () => {
    const register = window.confirm('Estas Seguro de Eliminar todos los servicios agregados?');
    if (register) {
      setServiciosTurno([]);
      setTotalCost(0)
    }


  };



  // metodo para actualizar el usuario del turno despues de guardarlo o actualizarlo
  const handleUpdatePacienteInfoAfterRegister = async (ci) => {
    let paciente = await getPacienteForTurno(ci);
    if (paciente) {
      setPacienteTurno(paciente);
    };

  };

  const handlePrintTurno = async () => {
    if (serviciosTurno.length === 0) {
      alert("Agrega al menos un servicio para imprimir");
      return;
    }


    const proforma = {
      paciente: { cedulaIdentidad: ciPaciente ? ciPaciente : "" },
      total: totalCost,
      servicios: serviciosTurno
    };

    const newProforma = window.confirm("Deseas IMPRIMIR esta PROFORMA");
    if (!newProforma) {
      alert("SE HA CANCELADO LA IMPRESIÓN");
      return;
    }

    try {
      const response = await axios.post(endPoint + '/api/v1/turno/impresion', proforma, {
        responseType: 'blob' // Indicar a Axios que esperamos un blob en la respuesta
      });

      // Crear un blob a partir de la respuesta
      const file = new Blob([response.data], { type: 'application/pdf' });

      // Crear una URL a partir del blob
      const fileURL = URL.createObjectURL(file);

      // Abrir una nueva pestaña con la URL del PDF
      window.open(fileURL);
    } catch (error) {
      alert(error.response.data);
      console.error(error);
    }
  };



  const openAddServiceModaL = () => {

    setIsModaladdServiceOpen(true)


  };




  return (
    <div className="p-8 w-full">

      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Nuevo Turno</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div>
          <label htmlFor="ci-paciente" className="block text-sm font-medium text-gray-700">CI Paciente</label>
          <input type="text" id="ci-paciente" value={ciPaciente} onChange={handleCiPacienteChange} maxLength="10" className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div >
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input type="text" id="nombre" value={pacienteTurno ? pacienteTurno.nombre : ''} readOnly className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>



        <div >
          <label htmlFor="tipo-paciente" className="block text-sm font-medium text-gray-700">Tipo de Paciente</label>
          <input type="text" id="tipo-paciente" value={pacienteTurno && pacienteTurno.tipoPaciente ? pacienteTurno.tipoPaciente.descripcion : ''} readOnly className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>


        <div >
          <label htmlFor="cargo-empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
          <input type="text" id="cargo-empresa" value={pacienteTurno && pacienteTurno.empresa ? pacienteTurno.empresa.descripcion : ''} readOnly className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>



        <div >
          <label htmlFor="dependencia" className="block text-sm font-medium text-gray-700">Dependencia</label>
          <input type="text" id="dependencia" value={pacienteTurno && pacienteTurno.dependencia ? pacienteTurno.dependencia.descripcion : ''} readOnly className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>



        <div className="flex items-end">
          <button onClick={() => { handlerCreateNewTurno() }} className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Generar Turno</button>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button onClick={openAddServiceModaL} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Añadir Servicio</button>
        <button onClick={handleDeleteBotton} className="bg-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Quitar Todos los Servicios</button>
      </div>
      <div className="mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Codigo</th>
              <th className="px-4 py-2">Servicio</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Precio Unitario</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">SubTotal</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {serviciosTurno.map((servicioTurno, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{servicioTurno.servicio.codigoServicio}</td>
                <td className="px-4 py-2 max-w-xs break-words">{servicioTurno.servicio.nombreServicio}</td>
                <td className="px-4 py-2">{servicioTurno.servicio.area.nombreArea}</td>
                <td className="px-4 py-2">{servicioTurno.servicio.precio}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={servicioTurno.cantidad}
                    onChange={(e) => {
                      if (e.target.value < 1) {
                        alert("LA CANTIDAD NO DEBE SER MENOR A 1")
                        return;
                      }
                      const newQuantity = parseInt(e.target.value, 10) || 0;
                      handleAddService(servicioTurno.servicio, newQuantity);
                    }}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </td>


                <td className="px-4 py-2">{servicioTurno.total}</td>
                <td className="px-4 py-2">
                  <button onClick={() => { handleDeleteServiceOfServices(servicioTurno) }} className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={() => {
            
            setDescuento(0);
            handleCalculateTotalCostWithDescuento(0);
            setEnableDescuentos(!enableDescuentos); 
            
          }}
          className="text-indigo-800 hover:underline"
        >
          {enableDescuentos ? 'Cancelar descuento' : 'Aplicar descuento'}
        </button>
      </div>

      {enableDescuentos && (
        <>
          <div className="mt-6 flex items-center justify-end space-x-4">
            <label className="block text-sm font-medium text-gray-700">
              Aplicar Descuento del
            </label>
            <input
              type="number"
              value={descuento}
              onChange={(e) => {
                if (e.target.value < 0) {
                  alert("LA CANTIDAD NO DEBE SER MENOR A 0");
                  return;
                }
                if (e.target.value > 100) {
                  alert("LA CANTIDAD NO DEBE SER MAYOR A 100");
                  return;
                }
                const descuento = parseInt(e.target.value, 10) || 0;
                setDescuento(descuento);
                handleCalculateTotalCostWithDescuento(descuento);
              }}
              className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
            />
            %
          </div>
          <div className="mt-6 flex items-center justify-end space-x-4">
            <label
              htmlFor="total-a-pagar"
              className="block text-sm font-medium text-gray-700"
            >
              Precio sin Descuento
            </label>
            <input
              type="text"
              id="total-a-pagar"
              value={(totalCost / (1 - descuento / 100)).toFixed(2)}
              readOnly
              className="ml-4 block w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
        </>
      )}



      <div className="mt-6 flex items-center justify-end space-x-4">
        <label htmlFor="total-a-pagar" className="block text-sm font-medium text-gray-700">Total a Pagar</label>
        <input type="text" id="total-a-pagar" value={totalCost.toFixed(2)} readOnly className="ml-4 block w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
      </div>

      <div className="mt-6 flex items-center justify-end space-x-4">
        <button onClick={handlePrintTurno} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Imprimir</button>
      </div>
      <AddServiceModal
        isOpen={isModaladdServiceOpen}
        onClose={() => setIsModaladdServiceOpen(false)}
        onAdd={handleAddService}
      />
      <CrearPacienteModal
        isOpen={isModalPacienteOpen}
        onClose={() => setIsModalPacienteOpen(false)}
        onSave={handleSavePaciente}
        institutions={institutions}
        empresas={empresas}
        tiposPacientes={tiposPacientes}
        generos={generos}
        paciente={existPaciente}
        actualizaInfoTurno={handleUpdatePacienteInfoAfterRegister}
      />
    </div>
  );
};

export default NuevoTurno;
