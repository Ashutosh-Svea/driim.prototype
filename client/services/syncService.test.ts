import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { getSyncApiBaseUrl, syncDreamChanges } from "@/services/syncService";
import { DreamSyncPayload } from "@/types/dream";

describe("syncService", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    delete process.env.EXPO_PUBLIC_SYNC_API_URL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns the default sync base URL without overrides", () => {
    assert.equal(getSyncApiBaseUrl(), "https://api.driim.app");
  });

  it("returns the configured sync base URL when provided", () => {
    process.env.EXPO_PUBLIC_SYNC_API_URL = "https://example.com";
    assert.equal(getSyncApiBaseUrl(), "https://example.com");
  });

  it("posts sync payload and returns JSON response", async () => {
    const payload: DreamSyncPayload = {
      deviceId: "device-1",
      lastSyncedAt: null,
      changes: [],
    };

    globalThis.fetch = async (input, init) => {
      assert.equal(input, "https://api.driim.app/dreams/sync");
      assert.deepEqual(init, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return new Response(JSON.stringify({ dreams: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    const result = await syncDreamChanges(payload);
    assert.deepEqual(result, { dreams: [] });
  });

  it("returns null for non-JSON responses", async () => {
    const payload: DreamSyncPayload = {
      deviceId: "device-2",
      lastSyncedAt: null,
      changes: [],
    };

    globalThis.fetch = async () =>
      new Response("", {
        status: 200,
        headers: { "content-type": "text/plain" },
      });

    const result = await syncDreamChanges(payload);
    assert.equal(result, null);
  });

  it("throws a descriptive error for failed responses", async () => {
    const payload: DreamSyncPayload = {
      deviceId: "device-3",
      lastSyncedAt: null,
      changes: [],
    };

    globalThis.fetch = async () =>
      new Response("Bad request", { status: 400, statusText: "Bad Request" });

    await assert.rejects(
      async () => syncDreamChanges(payload),
      (error: Error) => error.message === "400: Bad request"
    );
  });
});
