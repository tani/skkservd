import { Server, TextDictionary, NumericDictionary, CombinedDictionary } from "./mod.ts";
import { parse } from "std/flags/mod.ts";

const options = parse(Deno.args, {
  default: {
    port: 1178,
    dictionary: "/usr/share/skk/SKK-JISYO.L",
  },
});
const textdictionary = new TextDictionary();
await textdictionary.load(options.dictionary);
const numericdictionary = new NumericDictionary();
await numericdictionary.load(options.dictionary);
const dictionary = new CombinedDictionary(textdictionary, numericdictionary)
const server = new Server(dictionary);
server.listen(options as any);
