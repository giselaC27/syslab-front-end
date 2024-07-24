import React, { useState } from 'react';
import axios from 'axios';
import { data } from 'autoprefixer';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    //borrar despues
    //onLogin("prueba");
    //return;

    try {
      
      //const response = await axios.post('http://10.16.1.41:8082/api/v1/usuario/sesion', { email, contrasena: password });
      const userData={cedulaIdentidad:email,
        contrasena:password,        
      }
      const sucess=  await onLogin(userData);

      if (sucess) {
        console.log("exitoso")
        
       
         
    
      } else {
        setShowModal(true);
      }
      
    } catch (error) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center">
      <p className="text-6xl font-bold mb-8 text-indigo-500">S Y S L A B</p>
      <div className="bg-white bg-opacity-30 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Cédula de Identidad</label>
            <input 
              type="text" 
              id="email" 
              name="email" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ingresar
          </button>
        </form>
        <div className="mt-6 text-center">
          
        </div>
      </div>

      {/* Modal de error */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg z-50">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Credenciales Incorrectas</h2>
            <p className="text-gray-700">Las credenciales proporcionadas no son válidas. Por favor, inténtalo de nuevo.</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
