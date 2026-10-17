import api from "./axios";
import type { AddBlocklistRequest, AddBlocklistResponse } from "../types";

export const addToBlocklist = async (body: AddBlocklistRequest): Promise<AddBlocklistResponse> => {
  const { data } = await api.post<AddBlocklistResponse>("/api/admin/blocklist/add", body);
  return data;
};

// Unconfirmed shape: domain as a query param.
// If Swagger shows a body instead: api.delete(url, { data: { domain } })
// If it uses the id instead: api.delete(url, { params: { id } })
export const removeFromBlocklist = async (domain: string) => {
  const { data } = await api.delete("/api/admin/blocklist/remove", { params: { domain } });
  return data;
};