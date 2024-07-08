import React from 'react';

const StatsCards = ({ turnos }) => {
  const totalTurnos = turnos.length;
  const turnosPendientes = turnos.filter(turno => turno.estado === 'PENDIENTE').length;
  const turnosCompletados = turnos.filter(turno => turno.estado !== 'PENDIENTE').length;
  const porcentajePendientes = (turnosPendientes / totalTurnos) * 100 || 0;
  const porcentajeCompletados = (turnosCompletados / totalTurnos) * 100 || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Turnos</h3>
        <p className="text-2xl">{totalTurnos}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Turnos Pendientes</h3>
        <p className="text-2xl">{turnosPendientes}</p>
        <p className="text-sm">{porcentajePendientes.toFixed(2)}%</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-semibold">Turnos Completados</h3>
        <p className="text-2xl">{turnosCompletados}</p>
        <p className="text-sm">{porcentajeCompletados.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default StatsCards;