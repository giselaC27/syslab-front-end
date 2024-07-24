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
      console.log('API response:', response.data);
      if (response.data && Array.isArray(response.data)) {
        setTurnos(response.data);
      } else {
        console.error('La respuesta de la API no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching turnos:', error.response || error);
    }
  };

  const filterTurnos = () => {
    console.log('Filtering turnos. Total turnos:', turnos.length);
    console.log('Current filters:', filters);

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

    console.log('Filtered turnos:', filtered.length);
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
    </div>
  );
};

export default Dashboard;

