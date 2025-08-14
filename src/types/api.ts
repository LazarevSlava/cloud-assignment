export type ExistsResponse = { exists: boolean; id: string; source: string };
export type PutResponse = { ok: boolean; id: string; source: string };
export type DeleteResponse = {
  deleted: boolean;
  id: string;
  source: string;
  error?: string;
};