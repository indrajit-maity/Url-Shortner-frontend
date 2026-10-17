import axios from "axios"

export const TOKEN_KEY="token";
const api=axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL || "",
  headers:{"Content-Type":"application/json"},
});

api.interceptors.request.use((config)=>{
  const token=localStorage.getItem(TOKEN_KEY);
  if(token) config.headers.Authorization=`Bearer ${token}`;
  return config;
});

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string" && data) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (!error.response) return "Can't reach the server. Is the backend running?";
  }
  return fallback;
}

export default api;