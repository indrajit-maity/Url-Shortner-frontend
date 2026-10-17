import api from "./axios";
import type { UrlResponse } from "../types";

export const getMyUrls = async (): Promise<UrlResponse[]> => {
  const { data } = await api.get<UrlResponse[] | { content: UrlResponse[] }>("/api/dashboard/myurls");
  // Works for a plain array or a paginated { content: [...] } response
  return Array.isArray(data) ? data : data.content ?? [];
};