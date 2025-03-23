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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4">Filtros por paciente:</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Dependencias</label>
              <select name="dependencia" value={filters.dependencia} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Todas</option>
                {dependencias.map(dependencia => (
                  <option key={dependencia} value={dependencia}>{dependencia}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Empresas</label>
              <select name="empresa" value={filters.empresa} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Todas</option>
                {empresas.map(empresa => (
                  <option key={empresa} value={empresa}>{empresa}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Tipos de Paciente</label>
              <select name="tipoPaciente" value={filters.tipoPaciente} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Todos</option>
                {tiposPaciente.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div className="bg-gray-400 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Estados del Turno</label>
              <select name="estado" value={filters.estado} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm">
                <option value="">Todos</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Filtrado por fechas:</h2>
          <div className="grid grid-rows-2 gap-4">
            <div className="bg-gray-300 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Fecha inicial</label>
              <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="bg-gray-300 p-4 rounded-lg shadow-lg">
              <label className="block mb-2 text-sm font-medium text-black">Fecha final</label>
              <input type="date" name="endDate" value={filters.endDate} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mt-7">RESULTADOS</h1>
    </div>

  );
};

export default FilterBar;