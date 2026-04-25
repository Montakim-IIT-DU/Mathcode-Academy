import { useEffect, useMemo, useState } from "react";
import {
  clearAuthStorage,
  getToken,
  getUser,
  setToken,
  setUser
} from "../utils/storage";

function useAuth() {
  const [tokenState, setTokenState] = useState(getToken());
  const [userState, setUserState] = useState(getUser());

  useEffect(() => {
    setTokenState(getToken());
    setUserState(getUser());
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setTokenState(token);
    setUserState(user);
  };

  const logout = () => {
    clearAuthStorage();
    setTokenState(null);
    setUserState(null);
  };

  const value = useMemo(() => {
    return {
      token: tokenState,
      user: userState,
      isAuthenticated: Boolean(tokenState),
      isAdmin: userState?.role === "admin",
      login,
      logout
    };
  }, [tokenState, userState]);

  return value;
}

export default useAuth;