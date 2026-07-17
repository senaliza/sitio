import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { api, setToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("senaliza_token");
    if (!token) {
      setInitialized(true);
      return;
    }

    setToken(token);
    api
      .me()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setInitialized(true));
  }, []);

  const valor = useMemo(
    () => ({
      user,
      initialized,
      async login(email, password) {
        const data = await api.login({ email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [user, initialized],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
