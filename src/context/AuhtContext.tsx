import { createContext,useCallback,useContext,useMemo,useState,type ReactNode } from "react";

import { TOKEN_KEY } from "../api/axios";
import type { AuthUser } from "../types";
import { isTokenExpired } from "../utils/jwt";

const USER_KEY="user";

interface AuthContextValue{
  token:string|null;
  user:AuthUser|null;
  isAuthenticated:boolean;
  isAdmin:boolean;
  setSession:(token:string,user:AuthUser)=>void;
  logout:()=>void;
}

const AuthContext=createContext<AuthContextValue|null>(null);

function clearStorage(){
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function readStoredToken():string|null{
  const stored=localStorage.getItem(TOKEN_KEY);
  if(stored && isTokenExpired(stored)){
    clearStorage();
    return null;
  }
  return stored;
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({children}:{children:ReactNode}){
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<AuthUser | null>(() => (readStoredToken() ? readStoredUser() : null));

  const setSession = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isAdmin: !!user?.roles?.some((r) => r.toUpperCase().replace("ROLE_", "") === "ADMIN"),
      setSession,
      logout,
    }),
    [token, user, setSession, logout]
  );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}