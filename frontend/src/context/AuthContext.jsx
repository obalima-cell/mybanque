import { createContext, useState } from "react";
import { getToken, removeToken } from "../utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!getToken());

  const logout = () => {
    removeToken();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
