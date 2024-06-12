import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Administrador = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: '', email: '', contrasena: '', activo: true });
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.16.1.41:8082/api/v1/usuarios');
      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setNewUser({ nombre: '', email: '', contrasena: '', activo: true });
    setEditUser(null);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (isEditModalOpen) {
      setEditUser({ ...editUser, [name]: type === 'checkbox' ? checked : value });
    } else {
      setNewUser({ ...newUser, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSave = async () => {
    let currentErrors = {};
    if (!newUser.nombre) currentErrors.nombre = 'Este campo debe estar completo';
    if (!newUser.email) currentErrors.email = 'Este campo debe estar completo';
    if (!newUser.contrasena) currentErrors.contrasena = 'Este campo debe estar completo';

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      try {
        const response = await axios.post('http://10.16.1.41:8082/api/v1/usuario', newUser);
        if (response.status === 200) {
          fetchUsers();
          closeModal();
        }
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
      }
    }
  };

  const handleUpdate = async () => {
    let currentErrors = {};
    if (!editUser.nombre) currentErrors.nombre = 'Este campo debe estar completo';
    if (!editUser.email) currentErrors.email = 'Este campo debe estar completo';
    if (!editUser.contrasena) currentErrors.contrasena = 'Este campo debe estar completo';

    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      try {
        const response = await axios.put('http://10.16.1.41:8082/api/v1/usuario', editUser);
        if (response.status === 200) {
          fetchUsers();
          closeModal();
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(search.toLowerCase())
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
              <td className="py-2 px-4 border-b">{user.nombre}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.activo ? 'Activo' : 'Inactivo'}</td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => openEditModal(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium mr-2">Editar</button>
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
            name="nombre"
            value={newUser.nombre}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
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
        <div className="flex justify-center space-x-4">
          <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
          <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Guardar</button>
        </div>
      </div>
    </div>
      )}

      {isEditModalOpen && (
       
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Editar Usuario</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                type="text"
                name="nombre"
                value={editUser.nombre}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email}
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
                value={editUser.contrasena}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
              {errors.contrasena && <p className="text-red-500 text-xs mt-1">{errors.contrasena}</p>}
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="activo"
                  checked={editUser.activo}
                  onChange={handleInputChange}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-sm text-gray-700">Activo</span>
              </label>
            </div>
            <div className="flex justify-center space-x-4">
              <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">Cancelar</button>
              <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administrador
