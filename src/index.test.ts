import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { setGlobalDispatcher, Agent, Headers } from "undici";

describe("Worker", () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    setGlobalDispatcher(
      new Agent({
        connect: {
          rejectUnauthorized: false,
        },
      })
    );

    worker = await unstable_dev("src/index.ts", {
      localProtocol: "https",
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return Not Found.", async () => {
    const resp = await worker.fetch("https://127.0.0.1");
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(`"Not Found."`);
    }
  });

  it("should return good", async () => {
    const resp = await worker.fetch(
      "https://127.0.0.1/update?ip=1.1.1.1&hostname=test"
    );
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(`"good"`);
    }
  });
});
