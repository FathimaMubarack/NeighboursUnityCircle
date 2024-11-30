import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Role = {
  ADMIN: "admin",
  USER: "individual",
  ORGANIZATION: "organization",
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    authenticated: false,
    username: null,
    role: null,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userRole = await AsyncStorage.getItem("userRole");
        const username = await AsyncStorage.getItem("username");

        if (token && userRole && username) {
          setAuthState({
            authenticated: true,
            username: username,
            role: userRole,
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (username, role, token) => {
    if (!username || !role || !token) {
      console.error("Invalid login parameters", { username, role, token });
      return;
    }

    AsyncStorage.setItem("username", username).catch((error) =>
      console.error("Error saving username:", error)
    );
    AsyncStorage.setItem("userRole", role).catch((error) =>
      console.error("Error saving userRole:", error)
    );
    AsyncStorage.setItem("token", token).catch((error) =>
      console.error("Error saving token:", error)
    );

    setAuthState({
      authenticated: true,
      username: username,
      role: role,
    });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userRole");
    await AsyncStorage.removeItem("username");

    setAuthState({
      authenticated: false,
      username: null,
      role: null,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
