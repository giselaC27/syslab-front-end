import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Login from '/src/Components/Login/login';
import Panel from './Components/Panel/PrincipalPanel';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUsername(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      
      {isLoggedIn ? (
        <Panel onLogout={handleLogout} username={username} />
      ) : (
        //<Login onLogin={handleLogin} />
        <Panel onLogout={handleLogout} username={username} />
      )}
    </div>
  );
};
export default App;