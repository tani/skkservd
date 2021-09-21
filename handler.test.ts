import { Handler } from "./handler.ts";
import { withTemporaryDictionary } from "./util.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("handle 0-request", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    const handler = new Handler(dictionary);
    assertEquals(
      await handler.handle({ type: "0" }),
      { type: "0" },
    );
  });
});
Deno.test("handle 1-request", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    const handler = new Handler(dictionary);
    assertEquals(
      await handler.handle({ type: "1", body: "あi" }),
      { type: "1", body: "1/合い/会い/\n" },
    );
  });
});
Deno.test("handle 2-request", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    const handler = new Handler(dictionary);
    assertEquals(
      await handler.handle({ type: "2" }),
      { type: "2", body: "0.0.0 " },
    );
  });
});
Deno.test("handle 3-request", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    const handler = new Handler(dictionary);
    assertEquals(
      await handler.handle({ type: "3" }),
      { type: "3", body: "hostname:addr:...: " },
    );
  });
});
Deno.test("handle 4-request", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    const handler = new Handler(dictionary);
    assertEquals(
      await handler.handle({ type: "4", body: "あ" }),
      { type: "4", body: "4/あi/あめ/\n" },
    );
  });
});
