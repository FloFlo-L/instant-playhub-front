import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext<any>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState<any>(null);

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  const logout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem("token");
  };

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Failed to decode token", error);
      return true;
    }
  };

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        axios.get(`${import.meta.env.VITE_API_URL}/user/info`)
          .then(response => {
            console.log("User info", response.data);
            setUserInfo(response.data);
          })
          .catch(error => {
            console.error("Failed to fetch user info", error);
            if (error.response && error.response.status === 401) {
              logout();
            }
          });
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUserInfo(null);
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      userInfo,
      setToken,
      logout
    }),
    [token, userInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
