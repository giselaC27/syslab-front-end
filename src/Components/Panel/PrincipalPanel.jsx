import React, { useState, useContext } from 'react';
import NuevoTurno from '../Paciente/NuevoTurno';
import React, { useState } from 'react';
import NuevoTurno from '../Turno/NuevoTurno';
import Pacientes from '../Paciente/Pacientes';
import Turnos from '../Turno/Turnos';
import Servicios from '../Servicio/Servicios';
import Administrador from '../Usuario/Administrador';
import { AuthContext } from '../AuthContext';
import ConfiguracionModal from '../Usuario/ConfiguracionModal';

const MainPanel = ({ onLogout}) => {
import Proforma from '../Turno/Proforma';
const MainPanel = ({ onLogout, username }) => {
  const [activeView, setActiveView] = useState('default');
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  console.log()

  const renderContent = () => {
    switch (activeView) {
      case 'proforma':
        return <Proforma />;
      case 'nuevoTurno':
        return <NuevoTurno  />;
      case 'pacientes':
        return <Pacientes />;
      case 'turnos':
        return <Turnos />;
      case 'servicios': 
        return <Servicios />;
 
      case 'gestionPersonal':
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
        <p className="text-lg font-semibold">Bienvenido {user && user.nombre}</p>

        <div className="space-x-4">
        <button 
  onClick={() => setIsConfigModalOpen(true)} 
  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm font-medium"
>
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
        <button onClick={() => setActiveView('proforma')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "proforma" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}
            >
            Proforma
          </button>
          <button onClick={() => setActiveView('nuevoTurno')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "nuevoTurno" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}
            >
            Nuevo Turno
          </button>
          <button onClick={() => setActiveView('turnos')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "turnos" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
            Turnos
          </button>
          <button onClick={() => setActiveView('pacientes')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "pacientes" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
            Pacientes
          </button>
          <button onClick={() => setActiveView('servicios')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "servicios" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
            Servicios
          </button>
          <button onClick={() => setActiveView('informes')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "informes" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
          </button>        
          <button onClick={() => setActiveView('informes')} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium">
            Informes
          </button>
          <button onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)} className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium relative">
          <button onClick={() => setActiveView('descuentos')} className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "descuentos" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
            Descuentos
          </button>
          <button onClick={() => setActiveView('administrador')}className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${activeView === "administrador" ? "bg-indigo-900 text-white" : "bg-indigo-600"}`}>
            Administrador
            {isAdminMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button onClick={() => { setActiveView('servicios'); setIsAdminMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Servicios</button>
                <button onClick={() => { setActiveView('descuentos'); setIsAdminMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Descuentos</button>
                <button onClick={() => { setActiveView('gestionPersonal'); setIsAdminMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Gestión de Personal</button>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      {renderContent()}
      <ConfiguracionModal 
  isOpen={isConfigModalOpen} 
  onClose={() => setIsConfigModalOpen(false)} 
/>
    </div>
  );
};


export default MainPanel;
