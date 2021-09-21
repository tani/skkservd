import { Server, TextDictionary } from "./mod.ts";
import { parse } from "std/flags/mod.ts";

const options = parse(Deno.args, { default: { port: 1178 } });
const dictionary = new TextDictionary();
await dictionary.load(
  options.dictionary ?? "/usr/share/skk/SKK-JISYO.L",
  "euc-jp",
);
const server = new Server(dictionary);
server.listen(options as any);
