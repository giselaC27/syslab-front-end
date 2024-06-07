import React, { useState } from 'react';

const estados = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' }
];

const Administrador = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombres: '', email: '', contrasena: '', estado: '' });
  const [users, setUsers] = useState([
    { nombres: 'Juan Pérez', email: 'juan@example.com', estado: 'activo' },
    { nombres: 'Maria López', email: 'maria@example.com', estado: 'inactivo' }
  ]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({ nombres: '', email: '', contrasena: '', estado: '' });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSave = () => {
    let currentErrors = {};
    if (!newUser.nombres) currentErrors.nombres = 'Este campo debe estar completo';
    if (!newUser.email) currentErrors.email = 'Este campo debe estar completo';
    if (!newUser.contrasena) currentErrors.contrasena = 'Este campo debe estar completo';
    if (!newUser.estado) currentErrors.estado = 'Este campo debe estar completo';

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      setUsers([...users, newUser]);
      closeModal();
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.nombres.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full">
      <div className="flex items-center space-x-4 mb-6">
        <label className="block text-sm font-medium text-gray-700">Buscar</label>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
        />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Buscar</button>
      </div>

      <button onClick={openModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium mb-4">Agregar Usuario</button>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-indigo-500 text-white">
          <tr>
            <th className="py-2 px-4 border-b">Nombres</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{user.nombres}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.estado}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium mr-2">Editar</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Agregar Usuario</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={newUser.nombres}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              {errors.nombres && <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={newUser.contrasena}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              {errors.contrasena && <p className="text-red-500 text-xs mt-1">{errors.contrasena}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="estado"
                value={newUser.estado}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              >
                <option value="" disabled>Seleccionar un estado</option>
                {estados.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
              <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrador;