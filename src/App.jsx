import React, { useState, useEffect, useContext } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Cookies from 'js-cookie';

import Login from '/src/Components/Login/login';
import Panel from './Components/Panel/PrincipalPanel';
import { AuthContext } from './Components/AuthContext';
const App = () => {
  const {
    isLoggedIn, //estado de autenticacion 
    user,
    handleLogin,//proceso de autenticacion
    handleLogout,
  
  } = useContext(AuthContext);
 
  return (
    <div className="App">
      {isLoggedIn ? (
        <Panel onLogout={handleLogout} user={user} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
