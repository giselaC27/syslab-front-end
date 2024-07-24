import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { endPoint } from "./EndPoint";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkSession = async () => {
    const userFromCookie = Cookies.get("user");
    if (userFromCookie) {
      const userObject = JSON.parse(userFromCookie);
      setIsLoggedIn(true);
      setUser(userObject);
      console.log("Usuario desde el AuthContext:", userObject);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const handleLogin = async (userData) => {
    console.log("Datos de usuario para login:", userData);
    try {
      const response = await axios.post(
         endPoint + "/api/v1/usuario/sesion",
        { cedulaIdentidad: userData.cedulaIdentidad, contrasena: userData.contrasena }
      );
      if (response.data) {
        setIsLoggedIn(true);
        setUser(response.data);
        const userDataJson = JSON.stringify(response.data);
        Cookies.set("user", userDataJson);
        console.log("Datos de usuario después de login:", response.data);
        return true;
      } else {
        console.error("Error de autenticación:", response.data);
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      return false;
    }
  };

  const handleLogout = () => {
    Cookies.remove("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, handleLogin, handleLogout , setUser}}>
      {children}
    </AuthContext.Provider>
  );
};
