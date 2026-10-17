import api from "./axios";
import type { SignupRequest,LoginRequest,AuthResponse } from "../types";

export const signup=async(body:SignupRequest)=>{
  const {data} =await api.post("/api/auth/signup",body);
  return data;
};

export const login = async (body: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post("/api/auth/login", body);

  const token: string | undefined =
    typeof data === "string"
      ? data
      : data?.JWT_TOKEN ??
        data?.token ??
        data?.accessToken ??
        data?.jwt;

  if (!token) {
    console.error("Login response did not include a token:", data);
    throw new Error("Login response did not include a token");
  }

  return { token };
};