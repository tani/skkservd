import { TextDictionary } from "./text.ts";
import { NumericDictionary } from "./numeric.ts";

const rawTxtDic = `
;; okuri-ari entries
あi /合い/会い/
;; okuri-nasi entries
あめ /雨/飴/
`;

const rawNumDic = `
;; okuri-ari entries
;; okuri-nasi entries
#ばん /#0番/#1版/
`;

export async function withTemporaryDictionary(
  test: (dic: TextDictionary) => Promise<void>,
): Promise<void> {
  const dictionary = new TextDictionary();
  const tmp = await Deno.makeTempFile();
  await Deno.writeTextFile(tmp, rawTxtDic);
  await dictionary.load(tmp, "utf-8");
  await Deno.remove(tmp);
  await test(dictionary);
}

export async function withTemporaryNumericDictionary(
  test: (dic: NumericDictionary) => Promise<void>,
): Promise<void> {
  const dictionary = new NumericDictionary();
  const tmp = await Deno.makeTempFile();
  await Deno.writeTextFile(tmp, rawNumDic);
  await dictionary.load(tmp, "utf-8");
  await Deno.remove(tmp);
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
