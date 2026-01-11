import { DreamSyncPayload } from "@/types/dream";

const DEFAULT_SYNC_BASE_URL = "https://api.driim.app";

export function getSyncApiBaseUrl(): string {
  return process.env.EXPO_PUBLIC_SYNC_API_URL || DEFAULT_SYNC_BASE_URL;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function syncDreamChanges(payload: DreamSyncPayload) {
  const baseUrl = getSyncApiBaseUrl();
  const url = new URL("/dreams/sync", baseUrl);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await throwIfResNotOk(res);

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}
