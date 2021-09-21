import { TextDictionary } from "./dictionary.ts";

export async function withTemporaryDictionary(
  test: (dic: TextDictionary) => Promise<void>,
): Promise<void> {
  const dictionary = new TextDictionary();
  const tmpdic = await Deno.makeTempFile();
  await Deno.writeTextFile(tmpdic, "あi /合い/会い/\n" + "あめ /雨/飴/\n");
  await dictionary.load(tmpdic, "utf-8");
  await Deno.remove(tmpdic);
  await test(dictionary);
}

export function json(str: TemplateStringsArray, ...val: unknown[]): string {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    out += str[i];
    out += val[i] ? JSON.stringify(val[i]) : "";
  }
  return out;
}
