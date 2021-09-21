import { parse } from "./request.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test("parse 0-request", () => {
  assertEquals(parse("0"), { type: "0" });
});
Deno.test("parse 1-request", () => {
  assertEquals(parse("1あi "), { type: "1", body: "あi" });
});
Deno.test("parse 2-request", () => {
  assertEquals(parse("2"), { type: "2" });
});
Deno.test("parse 3-request", () => {
  assertEquals(parse("3"), { type: "3" });
});
Deno.test("parse 4-request", () => {
  assertEquals(parse("4あi "), { type: "4", body: "あi" });
});
