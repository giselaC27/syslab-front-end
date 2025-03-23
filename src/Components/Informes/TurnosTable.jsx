import React from 'react';

const TurnosTable = ({ turnos }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4 ">
      <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-black">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Num Turno</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha Turno</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Paciente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Dependencia</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Empresa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tipo Paciente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th>
          </tr>
        </thead>
        <tbody className="bg-gray-300 divide-y divide-gray-700">
          {turnos.map(turno => (
            <tr key={turno.idTurno}>
              <td className="px-6 py-4 whitespace-nowrap">{turno.numTurno}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(turno.fechaTurno).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{turno.estado}</td>
              <td className="px-6 py-4 whitespace-nowrap">{`${turno.paciente.nombre} ${turno.paciente.primerApellido}`}</td>
              <td className="px-6 py-4 whitespace-nowrap">{turno.paciente.dependencia.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap">{turno.paciente.empresa.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap">{turno.paciente.tipoPaciente.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap">{turno.total.toFixed(2)} $</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  );
};

export default TurnosTable;