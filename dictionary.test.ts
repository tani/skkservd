import { assertEquals } from "std/testing/asserts.ts";
import { withTemporaryDictionary } from "./util.ts";

Deno.test("text dictionary load", async () => {
  await withTemporaryDictionary((dictionary) => {
    assertEquals(dictionary.__debug, {
      okuriAri: { あi: ["合い", "会い"] },
      okuriNasi: { あめ: ["雨", "飴"] },
    });
    return Promise.resolve();
  });
});

Deno.test("text dictionary convert", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    assertEquals(await dictionary.convert("あi"), ["合い", "会い"]);
  });
});

Deno.test("text dictionary complete", async () => {
  await withTemporaryDictionary(async (dictionary) => {
    assertEquals(await dictionary.complete("あ"), ["あめ"]);
  });
});
