import { assertEquals } from "std/testing/asserts.ts";
import { withTemporaryDictionary, withTemporaryNumericDictionary } from "./util.ts";
import { convertNumber } from "./numeric.ts";

Deno.test("text dictionary load", async () => {
  await withTemporaryDictionary((dictionary) => {
    assertEquals(
      dictionary.__okuriAri,
      { あi: ["合い", "会い"] },
    );
    assertEquals(
      dictionary.__okuriNasi,
      { あめ: ["雨", "飴"] },
    );
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

Deno.test("convertNumber", () => {
  assertEquals(convertNumber("#0番", "#ばん"), "#番");
  assertEquals(convertNumber("#0番", "11ばん"), "11番");
  assertEquals(convertNumber("#1番", "11ばん"), "１１番");
  assertEquals(convertNumber("#2番", "11ばん"), "一一番");
  assertEquals(convertNumber("#3番", "11ばん"), "十一番");
  assertEquals(convertNumber("#0番#1番", "11ばん11ばん"), "11番１１番");
});

Deno.test("numeric dictionary convert", async () => {
  await withTemporaryNumericDictionary(async (dictionary) => {
    assertEquals(
      await dictionary.convert("11ばん"),
      ["11番", "１１版"],
    );
  });
});

Deno.test("numeric dictionary complete", async () => {
  await withTemporaryNumericDictionary(async (dictionary) => {
    assertEquals(
      await dictionary.complete("11ば"),
      ["11ばん"],
    );
  });
});
