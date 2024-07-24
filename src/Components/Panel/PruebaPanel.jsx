import React, { useState, useContext } from "react";
import NuevoTurno from "../Turno/NuevoTurno";
import Pacientes from "../Paciente/Pacientes";
import Turnos from "../Turno/Turnos";
import Servicios from "../Servicio/Servicios";
import Administrador from "../Usuario/Administrador";
import { AuthContext } from "../AuthContext";
import ConfiguracionModal from "../Usuario/ConfiguracionModal";
import Proforma from "../Turno/Proforma";
import axios from "axios";
import Dashboard from "../Informes/Dashboard";
import { endPoint } from "../EndPoint";
import Descuento from "../Descuentos/Descuento";
const MainPanel = ({ onLogout }) => {
  const [activeView, setActiveView] = useState("default");
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const resetNumTurnos = async () => {
    try {
      const confirmResetNumTurnos = window.confirm(
        "¿ESTÁS TOTALMENTE SEGURO DE RESTABLECER EL NÚMERO DE TURNOS?. ESTE PROCESO ES IRREVERSIBLE"
      );
      if (!confirmResetNumTurnos) {
        alert("ESTABLECIMIENTO CANCELADO");
        return;
      }

      const confirm2ResetNumTurnos = window.confirm(
        "¿ESTÁS TOTALMENTE SEGURO DE LA DECISIÓN?."
      );
      if (!confirm2ResetNumTurnos) {
        alert("ESTABLECIMIENTO CANCELADO");
        return;
      }

      await axios.get(endPoint + "/api/v1/turno/reinicio");

      alert("ESTABLECIMIENTO EXITOSO");
    } catch (error) {
      console.error("Error:", error);
      alert("Error:", error.response.data);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "proforma":
        return <Proforma />;
      case "nuevoTurno":
        return <NuevoTurno />;
      case "pacientes":
        return <Pacientes />;
      case "turnos":
        return <Turnos />;
      case "servicios":
        return <Servicios />;
      case "gestionPersonal":
        return <Administrador />;
      case "informes":
        return <Dashboard />;
      case "descuentos":
        return <Descuento />;
      default:
        return (
          <div
            className="flex-grow bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: "url(/path-to-your-background-image.jpg)",
            }}
          >
            <div className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
              <h1 className="text-4xl font-bold mb-4 text-indigo-500">
                Panel Principal
              </h1>
              <p className="text-lg text-gray-700">
                Selecciona una opción del menú de navegación para comenzar.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-indigo-500 text-white px-4 py-3 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Bienvenido {user && user.nombre}
        </p>
        <div className="space-x-4">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded text-sm font-medium"
          >
            Configuración
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <nav className="bg-indigo-600 text-white px-4 py-3 flex justify-center">
        <div className="space-x-4">
          {user && ["administrador", "secretario"].includes(user.rol) && (
            <>
              <button
                onClick={() => setActiveView("proforma")}
                className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${
                  activeView === "proforma"
                    ? "bg-indigo-900 text-white"
                    : "bg-indigo-600"
                }`}
              >
                Proforma
              </button>
              <button
                onClick={() => setActiveView("nuevoTurno")}
                className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${
                  activeView === "nuevoTurno"
                    ? "bg-indigo-900 text-white"
                    : "bg-indigo-600"
                }`}
              >
                Nuevo Turno
              </button>
            </>
          )}
          {user &&
            ["administrador", "secretario", "financiero"].includes(
              user.rol
            ) && (
              <button
                onClick={() => setActiveView("turnos")}
                className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${
                  activeView === "turnos"
                    ? "bg-indigo-900 text-white"
                    : "bg-indigo-600"
                }`}
              >
                Turnos
              </button>
            )}
          {user && ["administrador", "secretario"].includes(user.rol) && (
            <>
              <button
                onClick={() => setActiveView("pacientes")}
                className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${
                  activeView === "pacientes"
                    ? "bg-indigo-900 text-white"
                    : "bg-indigo-600"
                }`}
              >
                Pacientes
              </button>
              <button
                onClick={() => setActiveView("informes")}
                className={`hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium ${
                  activeView === "informes"
                    ? "bg-indigo-900 text-white"
                    : "bg-indigo-600"
                }`}
              >
                Informes
              </button>
            </>
          )}
          {user && user.rol === "administrador" && (
            <button
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="hover:bg-indigo-700 px-3 py-2 rounded text-sm font-medium relative"
            >
              Administrador
              {isAdminMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      setActiveView("servicios");
                      setIsAdminMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Servicios
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("descuentos");
                      setIsAdminMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descuentos
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("gestionPersonal");
                      setIsAdminMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Gestión de Personal
                  </button>
                </div>
              )}
            </button>
          )}
        </div>
      </nav>
      {renderContent()}
      <ConfiguracionModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
};

export default MainPanel;
