import { createContext,useCallback,useContext,useMemo,useState,type ReactNode } from "react";

import { TOKEN_KEY } from "../api/axios";

interface AuthContextValue{
  token:string|null;
  isAuthenticated:boolean;
  setSession:(token:string)=>void;
  logout:()=>void;
}

const AuthContext=createContext<AuthContextValue|null>(null);

export function AuthProvider({children}:{children:ReactNode}){
  const [token,setToken]=useState<string|null>(()=>localStorage.getItem(TOKEN_KEY));
  const setSession=useCallback((t:string)=>{
    localStorage.setItem(TOKEN_KEY,t);
    setToken(t);
  },[]);
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);
  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, setSession, logout }),
    [token, setSession, logout]
  );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}