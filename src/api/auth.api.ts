import api from "./axios";
import type { SignupRequest,LoginRequest,AuthResponse ,AuthUser,LoginResponse} from "../types";

export const signup=async(body:SignupRequest)=>{
  const {data} =await api.post("/api/auth/signup",body);
  return data;
};

export const login = async (
  body: LoginRequest
): Promise<{ token: string; user: AuthUser }> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", body);
  const { JWT_TOKEN, ...user } = data;
  if (!JWT_TOKEN) throw new Error("Login response did not include a token");
  return { token: JWT_TOKEN, user };
};