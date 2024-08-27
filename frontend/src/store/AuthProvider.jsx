import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  user: '',
  saveUser: () => {},
  logOut: () => {},
  isLoading: true,
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('userToken');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const saveUser = useCallback((data) => {
    if (data !== user) {
      setUser(data);
      localStorage.setItem('userToken', data);
    }
  }, [user]);

  const logOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('userToken');
  }, []);

  const contextValue = useMemo(() => ({
    user,
    saveUser,
    logOut,
    isLoading,
  }), [user, saveUser, logOut, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
