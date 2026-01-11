import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createSyncPayload,
  enqueueDeleteChange,
  enqueueUpsertChange,
} from "@/contexts/dreamSyncQueue";
import { Dream, DreamSyncChange } from "@/types/dream";

const baseDream: Dream = {
  id: "dream-1",
  title: "Night Flight",
  content: "Flying through clouds.",
  date: "2024-01-01T00:00:00.000Z",
  lucidityLevel: 3,
  clarityLevel: 4,
  emotions: [],
  tags: [],
  dreamSigns: [],
  people: [],
  places: [],
  themes: [],
  rating: 3,
  isNightmare: false,
  isRecurring: false,
  isPrivate: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

describe("dreamSyncQueue", () => {
  it("enqueues upsert changes and removes older entries for the same dream", () => {
    const existing: DreamSyncChange[] = [
      { id: "dream-1", type: "delete", updatedAt: "2024-01-01T00:00:00.000Z" },
      { id: "dream-2", type: "upsert", updatedAt: "2024-01-01T00:00:00.000Z" },
    ];

    const updatedDream = { ...baseDream, updatedAt: "2024-01-03T00:00:00.000Z" };
    const result = enqueueUpsertChange(existing, updatedDream);

    assert.equal(result[0].type, "upsert");
    assert.equal(result[0].id, "dream-1");
    assert.equal(result.length, 2);
    assert.equal(result[1].id, "dream-2");
  });

  it("enqueues delete changes and removes older entries for the same dream", () => {
    const existing: DreamSyncChange[] = [
      {
        id: "dream-1",
        type: "upsert",
        updatedAt: "2024-01-01T00:00:00.000Z",
        dream: baseDream,
      },
    ];

    const result = enqueueDeleteChange(
      existing,
      "dream-1",
      "2024-02-01T00:00:00.000Z"
    );

    assert.equal(result[0].type, "delete");
    assert.equal(result[0].updatedAt, "2024-02-01T00:00:00.000Z");
    assert.equal(result.length, 1);
  });

  it("creates sync payloads with last sync metadata", () => {
    const changes: DreamSyncChange[] = [
      {
        id: "dream-1",
        type: "upsert",
        updatedAt: "2024-01-02T00:00:00.000Z",
        dream: baseDream,
      },
    ];

    const payload = createSyncPayload("device-1", "2024-01-05T00:00:00.000Z", changes);

    assert.equal(payload.deviceId, "device-1");
    assert.equal(payload.lastSyncedAt, "2024-01-05T00:00:00.000Z");
    assert.deepEqual(payload.changes, changes);
  });
});
