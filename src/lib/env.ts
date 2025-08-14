const rawBase = import.meta.env.VITE_API_BASE as string | undefined;
const rawKey = import.meta.env.VITE_API_KEY as string | undefined;

if (!rawBase) console.warn("VITE_API_BASE is not set");
if (!rawKey) console.warn("VITE_API_KEY is not set");

export const ENV = {
  apiBase: rawBase ?? "",
  apiKey: rawKey ?? "",
} as const;