import api from "./axios";
import type { UrlRequest, UrlResponse } from "../types";

export const createShortUrl = async (body: UrlRequest): Promise<UrlResponse> => {
  const { data } = await api.post<UrlResponse>("/api/urls/create", body);
  return data;
};