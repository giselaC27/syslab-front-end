import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Cookies from 'js-cookie';

import Login from '/src/Components/Login/login';
import Panel from './Components/Panel/PrincipalPanel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const sessionData = JSON.parse(sessionCookie);
      setIsLoggedIn(true);
      setUsername(sessionData.nombre);
    }
  }, []);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
    Cookies.set('session', JSON.stringify({ nombre: name }), { expires: 1 }); // Expira en 1 día
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    Cookies.remove('session');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Panel onLogout={handleLogout} username={username} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App; 
