import React from 'react';

const FilterBar = ({ filters, setFilters, dependencias, empresas, tiposPaciente, estados }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div className="mb-4 p-4 bg-white shadow rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Dependencia</label>
          <select name="dependencia" value={filters.dependencia} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Todas</option>
            {dependencias.map(dependencia => (
              <option key={dependencia} value={dependencia}>{dependencia}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Empresa</label>
          <select name="empresa" value={filters.empresa} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Todas</option>
            {empresas.map(empresa => (
              <option key={empresa} value={empresa}>{empresa}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Tipo de Paciente</label>
          <select name="tipoPaciente" value={filters.tipoPaciente} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Todos</option>
            {tiposPaciente.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Estado</label>
          <select name="estado" value={filters.estado} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Todos</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Desde</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Hasta</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;