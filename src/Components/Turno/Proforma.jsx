import React, { useState, useEffect } from 'react';
import AddServiceModal from './AddServiceModal';
import axios from 'axios';
import { endPoint } from '../EndPoint';

const Proforma = () => {
  const [isModaladdServiceOpen, setIsModaladdServiceOpen] = useState(false);
  const [ciPaciente, setCiPaciente] = useState('');
  const [serviciosTurno, setServiciosTurno] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Función para limpiar el estado
  const clearState = () => {
    setCiPaciente('');
    setServiciosTurno([]);
    setTotalCost(0);
  };



  const handleAddService = (service, quantity) => {
    quantity = parseInt(quantity);

    setServiciosTurno(prevServiciosTurno => {
      const existingServiceIndex = prevServiciosTurno.findIndex(item => item.servicio.idServicios === service.idServicios);

      if (existingServiceIndex !== -1) {
        const updatedServiciosTurno = [...prevServiciosTurno];
        updatedServiciosTurno[existingServiceIndex].cantidad = quantity; // Actualiza solo la cantidad
        updatedServiciosTurno[existingServiceIndex].total = service.precio * quantity; // Recalcula el total
        handleCalculateTotalCost(updatedServiciosTurno); // Recalcula el total general
        return updatedServiciosTurno;
      } else {
        const newServicioTurno = {
          cantidad: quantity,
          servicio: service,
          total: service.precio * quantity
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
    setTotalCost(totalCostLocal);
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

  const handlerCreateNewProforma = async () => {
    if (ciPaciente === "" || ciPaciente.length !== 10) {
      alert("Debe colocar la cédula del paciente y debe tener 10 digitos.");
      return;
    }

    if (serviciosTurno.length === 0) {
      alert("Agrega al menos un servicio para proformar");
      return;
    }


    const proforma = {
      paciente: { cedulaIdentidad: ciPaciente },
      total: totalCost,
      servicios: serviciosTurno,
      usuario:{
        idUsuario:1
      }
    };

    console.log(proforma)
    const newProforma = window.confirm("Deseas crear una nueva PROFORMA");
    if (!newProforma) {
      alert("PROFORMA NO GENERADA");
      return;
    }

    try {
      await axios.post(endPoint + '/api/v1/proforma', proforma);
      alert('PROFORMA CREADA CORRECTAMENTE PODRAS RECUPERARLA CON LA CEDULA DEL PACIENTE');
      clearState();
    } catch (error) {
      //alert(error.response.data);
      console.error(error);
    }
  };


  // metodo para obtener la informacion del paciente que va a registrar un nuevo turno  
  const handleCiPacienteChange = async (event) => {
    setCiPaciente(event.target.value);
    if (event.target.value.length < 10) {
    }
    if (event.target.value.length === 10) {

      let paciente = await getPacienteForTurno(event.target.value);

      // si el paciente no existe se pregunta si se desea registrar
      if (!paciente) {
        alert('El paciente con CI : ' + event.target.value + ' no está registrado.Si deseas registrarlo ve a TURNO o PACIENTES');
        return;
      }

      //se procede a inspeccionar si el paciente no tiene proformas pendientes
      let proforma = await getProformaByPaciente(event.target.value);

      if (!proforma) {
        return;
      }

      const showProforma = window.confirm('El paciente cuenta con una proforma pendiente.¿Deseas recuperarla?');
      // se rellena la informacion con la de la proforma
      if (showProforma) {
        setServiciosTurno(proforma.servicios);
        setTotalCost(proforma.total);
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

  const handlePrintTurno=async()=>{
    if (serviciosTurno.length === 0) {
      alert("Agrega al menos un servicio para imprimir");
      return;
    }


    const proforma = {
      paciente: { cedulaIdentidad: ciPaciente? ciPaciente:"" },
      total: totalCost,
      servicios: serviciosTurno
    };

    console.log(proforma)
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




  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Proforma</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div>
          <label htmlFor="ci-paciente" className="block text-sm font-medium text-gray-700">CI Paciente</label>
          <input type="text" id="ci-paciente" value={ciPaciente} onChange={handleCiPacienteChange} maxLength="10" className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        <div className="flex items-end">
          <button onClick={() => { handlerCreateNewProforma() }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Generar Proforma</button>

        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button onClick={() => setIsModaladdServiceOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium">Añadir Servicio</button>
        <button onClick={handleDeleteBotton} className="bg-red-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium">Quitar Todos los Servicios</button>

      </div>
      <div className="mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="px-4 py-2">Codigo</th>
              <th className="px-4 py-2">Servicio</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {serviciosTurno.map((servicioTurno, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{servicioTurno.servicio.codigoServicio}</td>
                <td className="px-4 py-2 max-w-xs break-words">{servicioTurno.servicio.nombreServicio}</td>
                <td className="px-4 py-2">{servicioTurno.servicio.area.nombreArea}</td>
                <td className="px-4 py-2">{(servicioTurno.servicio.precio).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={servicioTurno.cantidad}
                    onChange={(e) => {
                      if(e.target.value<1){
                        alert("LA CANTIDAD NO DEBE SER MENOR A 1")
                        return;
                      }
                      const newQuantity = parseInt(e.target.value, 10) || 0;
                      handleAddService(servicioTurno.servicio, newQuantity);
                    }}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2">{servicioTurno.total.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button onClick={() => { handleDeleteServiceOfServices(servicioTurno) }} className="ml-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-end space-x-4">
        <label htmlFor="total-a-pagar" className="block text-sm font-medium text-gray-700">Total a Pagar</label>
        <input type="text" id="total-a-pagar" value={totalCost.toFixed(2)} readOnly className="ml-4 block w-24 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
        <button onClick={handlePrintTurno} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Imprimir</button>
      </div>
      <AddServiceModal
        isOpen={isModaladdServiceOpen}
        onClose={() => setIsModaladdServiceOpen(false)}
        onAdd={handleAddService}
      />

    </div>
  );
};

export default Proforma;
