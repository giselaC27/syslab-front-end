import React, { useState } from 'react';
import NuevoTurno from '../Paciente/NuevoTurno';
import Pacientes from '../Paciente/Pacientes';
import Turnos from '../Paciente/Turnos';
import Servicios from '../Servicio/Servicios';
import Administrador from '../Usuario/Administrador';

const MainPanel = ({ onLogout, username }) => {
  const [activeView, setActiveView] = useState('default');
  const renderContent = () => {
    switch (activeView) {
      case 'nuevoTurno':
        return <NuevoTurno />;
      case 'pacientes':
        return <Pacientes />;
      case 'turnos':
        return <Turnos />;
      case 'servicios': 
        return <Servicios />;
      case 'administrador':
        return <Administrador />;
      // Agrega más casos para otras vistas
      default:
        return (
          <div className="flex-grow bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url(/path-to-your-background-image.jpg)' }}>
            <div className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
              <h1 className="text-4xl font-bold mb-4 text-indigo-500">Panel Principal</h1>
              <p className="text-lg text-gray-700">Selecciona una opción del menú de navegación para comenzar.</p>
            </div>
          </div>
        );
        
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Primer Navbar */}
      <nav className="bg-indigo-500 text-white px-4 py-3 flex justify-between items-center">
        <p className="text-lg font-semibold">Bienvenido {username}</p>

        <div className="space-x-4">
          <button className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm font-medium">
            Configuración
          </button>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm font-medium">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Segundo Navbar */}
      <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-center">
        <div className="space-x-4">
          <button onClick={() => setActiveView('nuevoTurno')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Nuevo Turno
          </button>
          <button onClick={() => setActiveView('turnos')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Turnos
          </button>
          <button onClick={() => setActiveView('pacientes')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Pacientes
          </button>
          <button onClick={() => setActiveView('servicios')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Servicios
          </button>
          <button onClick={() => setActiveView('informes')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Informes
          </button>
          <button onClick={() => setActiveView('descuentos')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Descuentos
          </button>
          <button onClick={() => setActiveView('administrador')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Administrador
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      {renderContent()}
    </div>
  );
};

export default MainPanel;


