import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Components/AuthContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <AuthProvider>
      <App /> {/*  lógica y la estructura de la aplicación.  */}
    </AuthProvider>
  </React.StrictMode>,
  
)
