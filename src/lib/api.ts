import { ENV } from "./env";
import type { DeleteResponse, ExistsResponse, PutResponse } from "../types/api";

async function fetchJson<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  const baseHeaders: Record<string, string> = { "x-api-key": ENV.apiKey };
  const hasBody = !!init.body;
  const headers = hasBody ? { ...baseHeaders, "Content-Type": "application/json" } : baseHeaders;

  const res = await fetch(input, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  const text = await res.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Bad JSON: ${text}`);
  }
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data as T;
}

export const api = {
  async putCustomer(id: string) {
    return fetchJson<PutResponse>(`${ENV.apiBase}/customer`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  },
  async getCustomer(id: string) {
    const url = new URL(`${ENV.apiBase}/customer`);
    url.searchParams.set("id", id);
    return fetchJson<ExistsResponse>(url.toString(), { method: "GET" });
  },
  async deleteCustomer(id: string) {
    const url = new URL(`${ENV.apiBase}/customer`);
    url.searchParams.set("id", id);
    return fetchJson<DeleteResponse>(url.toString(), { method: "DELETE" });
  },
};