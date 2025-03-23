import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import StatsCards from './StatsCard';
import TurnosTable from './TurnosTable';
import axios from 'axios';
import { endPoint } from '../EndPoint';

const Dashboard = () => {
  const [turnos, setTurnos] = useState([]);
  const [filteredTurnos, setFilteredTurnos] = useState([]);
  const [filters, setFilters] = useState({
    empresa: '',
    dependencia: '',
    tipoPaciente: '',
    estado: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTurnos();
  }, []);

  useEffect(() => {
    filterTurnos();
  }, [turnos, filters]);

  const fetchTurnos = async () => {
    
    try {
      const response = await axios.get(endPoint + '/api/v1/informe/turnos');
      if (response.data && Array.isArray(response.data)) {
        const turnosData = response.data.map(turno => {
          // Reemplaza cada elemento en servicios con el número 1
          return {
            ...turno,
            servicios: turno.servicios.map(() => {})
          };
        });
        setTurnos(turnosData);
      } else {
        console.error('La respuesta de la API no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching turnos:', error.response || error);
    }
  };

  const getReportAboutTurnos = async () => {
    const newProforma = window.confirm("¿Deseas descargar este informe en formato Excel?");
    if (!newProforma) {
      alert("SE HA CANCELADO LA DESCARGA");
      return;
    }
    
    try {
      const response = await axios.post(`${endPoint}/api/v1/informe/reporte-turnos/excel`, filteredTurnos, {
        params: {
          tipoPaciente: filters.tipoPaciente || '',
          dependencia: filters.dependencia || '',
          empresa: filters.empresa || '',
          fechaInicio: filters.startDate || '',
          fechaFin: filters.endDate || '',
          estado: filters.estado|| ''
        },
        responseType: 'blob'
      });
      
      // Crear un blob a partir de la respuesta
      const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Crear una URL a partir del blob
      const fileURL = URL.createObjectURL(file);
  
      // Crear un enlace temporal para la descarga
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = 'Reporte_Turnos.xlsx'; // Nombre sugerido para el archivo descargado
      document.body.appendChild(a);
      a.click();
  
      // Eliminar el enlace temporal
      document.body.removeChild(a);
  
    } catch (error) {
      console.error('Error fetching turnos:', error.response || error);
    }
  };

  const handlePrintTurno = async () => {



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

  const filterTurnos = () => {

    let filtered = turnos;

    if (filters.empresa) {
      filtered = filtered.filter(turno =>
        turno.paciente.empresa.descripcion === filters.empresa
      );
    }

    if (filters.dependencia) {
      filtered = filtered.filter(turno =>
        turno.paciente.dependencia.descripcion === filters.dependencia
      );
    }

    if (filters.tipoPaciente) {
      filtered = filtered.filter(turno =>
        turno.paciente.tipoPaciente.descripcion === filters.tipoPaciente
      );
    }

    if (filters.estado) {
      filtered = filtered.filter(turno => turno.estado === filters.estado);
    }

    if (filters.startDate) {
      filtered = filtered.filter(turno => new Date(turno.fechaTurno).toISOString().split('T')[0] >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(turno => new Date(turno.fechaTurno).toISOString().split('T')[0] <= filters.endDate);
    }

    setFilteredTurnos(filtered);
  };

  const uniqueValues = (key) => [...new Set(turnos.map(turno => turno.paciente[key].descripcion))];

  const dependencias = uniqueValues('dependencia');
  const empresas = uniqueValues('empresa');
  const tiposPaciente = uniqueValues('tipoPaciente');
  const estados = [...new Set(turnos.map(turno => turno.estado))];

  return (
    <div className="container mx-auto p-4">
      
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        dependencias={dependencias}
        empresas={empresas}
        tiposPaciente={tiposPaciente}
        estados={estados}
      />
      
      <StatsCards turnos={filteredTurnos} />
      <TurnosTable turnos={filteredTurnos} />

      <button
        className="flex-grow bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium text-left"
        onClick={getReportAboutTurnos}
      >
        Descargar Reporte
      </button>
    </div>
  );
};

export default Dashboard;

