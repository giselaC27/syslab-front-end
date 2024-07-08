import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Turnos = () => {

  const [turnos, setTurnos] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [activeTab, setActiveTab] = useState("TODOS");
  const [ciPacienteSearched, setCiPacienteSearched] = useState("");


  useEffect(() => {
    fetchTurnosByEstado("TODOS");
  }, []);

  const fetchTurnosByEstado = async (estado) => {
    try {
      setTurnos([]);
      let response = [];
      if (estado === "TODOS") {
        response = await axios.get('http://10.16.1.41:8080/api/v1/turnos');
      } else {
        response = await axios.get('http://10.16.1.41:8082/api/v1/turnos/estado/' + estado);
      }

      console.log(response.data)
      setTurnos(response.data);
      setActiveTab(estado);

    } catch (error) {
      console.error('Error:', error);
      alert('Error:', error.response.data)
    }
  };

  const handleVerDetalle = (turno) => {
    setSelectedTurno(turno);
    setViewDetails(true);
  };

  const handleVolverAtras = () => {
    setViewDetails(false);
    setSelectedTurno(null);
    fetchTurnosByEstado("TODOS");
    setSelectedPrinter("NINGUNA")
  };

  const handleChangeStateTurno = async (idTurno, state) => {
    const confirm = window.confirm("Estás seguro de cambiar el estado como: " + state);
    if (!confirm) {
      alert("NO SE CAMBIADO EL ESTADO DEL TURNO");
      return;
    }


    try {
      //peticion para cambiar el estado de un turno, solo cuando se cambia a estado recibido, se enviar la impresora con datos
      const response = await axios.get('http://10.16.1.41:8080/api/v1/turno/estado/' + idTurno + "/" + state);
      if (response.status === 200) {
        alert("TURNO ACTUALIZADO CON ÉXITO");
        handleVolverAtras();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error:', error.response.data);
    }
  };

  const getEstadoBarra = (estado) => {
    const barra = {
      PENDIENTE: "bg-red-500 w-1/3",
      PAGADO: "bg-yellow-500 w-2/3",
      RECIBIDO: "bg-green-500 w-full",
    };
    return barra[estado] || "bg-red-900 w-full";
  };

  const fetchTurnosByPaciente = async () => {
    if (ciPacienteSearched === "") {
      alert("INGRESA UNA CEDULA DE IDENTIDAD PARA BUSCAR")
      return;
    }

    if (ciPacienteSearched.length < 10) {
      alert("INGRESA UNA CEDULA DE IDENTIDAD VÁLIDA PARA BUSCAR")
      return;
    }

    try {
      setTurnos([]);
      const response = await axios.get('http://10.16.1.41:8082/api/v1/turnos/ci/' + ciPacienteSearched);
      setTurnos(response.data);
      setActiveTab("TODOS");
    } catch (error) {
      console.error('Error:', error);
      alert('Error:', error.response.data)
    }

  };



  const handleInputChange = (event) => {
    setCiPacienteSearched(event.target.value);
  };

  const handleChoosePrinter = (printer) => {
    setPrinterSelected(printer);
  }

  return (
    <div className="p-8 w-full">
      <h1 className="text-4xl font-bold mb-4 text-indigo-500">Turnos</h1>


      {!viewDetails ? (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="buscar" className="block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="text"
              id="buscar"
              value={ciPacienteSearched}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button onClick={fetchTurnosByPaciente} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Buscar</button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center">
              <button
                onClick={() => fetchTurnosByEstado("TODOS")}
                className={`px-4 py-2 rounded-l-md text-sm font-medium ${activeTab === "TODOS" ? "bg-blue-900 text-white" : "bg-blue-500 text-white hover:bg-blue-600"}`}
              >
                Todos los turnos 
              </button>
              <button
                onClick={() => fetchTurnosByEstado("PENDIENTE")}
                className={`px-4 py-2 text-sm font-medium ${activeTab === "PENDIENTE" ? "bg-indigo-600 text-white" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                Turnos Pendientes
              </button>
              <button
                onClick={() => fetchTurnosByEstado("PAGADO")}
                className={`px-4 py-2 rounded-r-md text-sm font-medium ${activeTab === "PAGADO" ? "bg-indigo-600 text-white" : "bg-yellow-500 text-white hover:bg-yellow-600"}`}
              >
                Turnos Pagados
              </button>
             
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-indigo-500 text-white">
                  <tr>
                    <th className="px-4 py-2">Nro de Turno</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">CI Paciente</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Detalle</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {turnos.map(turno => {
                    const fecha = new Date(turno.fechaTurno).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });

                    const nombreCompleto = [
                      turno.paciente.nombre,
                      turno.paciente.primerApellido,
                      turno.paciente.segundoApellido
                    ].filter(Boolean).join(' ');

                    return (
                      <tr key={turno.idTurno} className="bg-white border-b border-gray-200">
                        <td className="px-4 py-2">{turno.numTurno}</td>
                        <td className="px-4 py-2">{fecha}</td>
                        <td className="px-4 py-2">{turno.paciente.cedulaIdentidad}</td>
                        <td className="px-4 py-2">{nombreCompleto}</td>
                        <td className="px-4 py-2">{turno.total}</td>
                        <td className="px-4 py-2">
                          <div className="w-full h-4 bg-gray-200 rounded">
                            <div className={`${getEstadoBarra(turno.estado)} h-4 rounded`}></div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium"
                            onClick={() => handleVerDetalle(turno)}
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div id="details-windows" className="mt-8">

          <h3 className="text-xl font-bold mb-4">DETALLE</h3>

          <div className="flex justify-end space-x-4 mt-6 ">
            {(selectedTurno.estado === 'PENDIENTE' || (selectedTurno.estado === 'PAGADO')) && (
              <button onClick={() => handleChangeStateTurno(selectedTurno.idTurno, "CANCELADO")} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar Turno</button>
            )}

          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nro de Turno</label>
              <input
                type="text"
                value={selectedTurno.idTurno}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CI Paciente</label>
              <input
                type="text"
                value={selectedTurno.paciente.cedulaIdentidad}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={[selectedTurno.paciente.nombre, selectedTurno.paciente.primerApellido, selectedTurno.paciente.segundoApellido].filter(Boolean).join(' ')}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="text"
                value={selectedTurno.total}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                value={selectedTurno.estado}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-indigo-400">
                <tr>
                  <th className="px-4 py-2">Número</th>
                  <th className="px-4 py-2">Servicio</th>
                  <th className="px-4 py-2">Área</th>
                  <th className="px-4 py-2">Valor</th>
                  <th className="px-4 py-2">Descuento</th>
                  <th className="px-4 py-2">Cantidad</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedTurno.servicios.map((servicioTurno) => (
                  <tr key={servicioTurno.servicio.idServicios}>
                    <td className="px-4 py-2">{servicioTurno.servicio.codigoServicio}</td>
                    <td className="px-4 py-2 max-w-xs break-words">{servicioTurno.servicio.nombreServicio}</td>
                    <td className="px-4 py-2">{servicioTurno.servicio.area.nombreArea}</td>
                    <td className="px-4 py-2">{servicioTurno.servicio.precio}</td>
                    <td className="px-4 py-2">0</td>
                    <td className="px-4 py-2">{servicioTurno.cantidad}</td>
                    <td className="px-4 py-2">{servicioTurno.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {(selectedTurno.estado === 'PAGADO') && (
              <button
                onClick={() => handleChangeStateTurno(selectedTurno.idTurno, "PENDIENTE")}
                className="bg-red-500 hover:bg-red-200 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Marcar como Pendiente
              </button>
            )}
            {(selectedTurno.estado === 'PENDIENTE') && (
              <button
                onClick={() => handleChangeStateTurno(selectedTurno.idTurno, "PAGADO")}
                className=" bg-yellow-500 hover:bg-yellow-200 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Marcar como Pagado
              </button>
            )}
            {(selectedTurno.estado === 'PAGADO') && (
              <button
                onClick={() => handleChangeStateTurno(selectedTurno.idTurno, "RECIBIDO")}
                className="bg-green-500 hover:bg-green-200 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Recepción de Muestras
              </button>
            )}

            <button
              onClick={handleVolverAtras}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium mb-4"
            >
              Atrás
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default Turnos;