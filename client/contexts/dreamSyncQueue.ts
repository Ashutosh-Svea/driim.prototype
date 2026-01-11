import { Dream, DreamSyncChange, DreamSyncPayload } from "@/types/dream";

export function enqueueUpsertChange(
  queue: DreamSyncChange[],
  dream: Dream
): DreamSyncChange[] {
  const filtered = queue.filter((change) => change.id !== dream.id);
  return [
    {
      id: dream.id,
      type: "upsert",
      updatedAt: dream.updatedAt,
      dream,
    },
    ...filtered,
  ];
}

export function enqueueDeleteChange(
  queue: DreamSyncChange[],
  id: string,
  timestamp: string
): DreamSyncChange[] {
  const filtered = queue.filter((change) => change.id !== id);
  return [
    {
      id,
      type: "delete",
      updatedAt: timestamp,
    },
    ...filtered,
  ];
}

export function createSyncPayload(
  deviceId: string,
  lastSyncedAt: string | null,
  changes: DreamSyncChange[]
): DreamSyncPayload {
  return {
    deviceId,
    lastSyncedAt,
    changes,
  };
}
