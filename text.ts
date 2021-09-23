import iconv from "iconv";
import { Dictionary } from "./dictionary.ts"

export class TextDictionary implements Dictionary {
  #okuriAri: Map<string, string[]> = new Map();
  #okuriNasi: Map<string, string[]> = new Map();
  get __okuriNasi() {
    return Object.fromEntries(this.#okuriNasi.entries());
  }
  get __okuriAri() {
    return Object.fromEntries(this.#okuriAri.entries());
  }
  async load(
    path: Parameters<typeof Deno.readFile>[0],
    encording = "euc-jp",
  ): Promise<void> {
    const blob = await Deno.readFile(path);
    const [okuriAri, okuriNasi] = iconv.decode(blob, encording)
      .split(";; okuri-nasi entries") as [string, string];
    const pattern = /^(?<!;)(.*) \/(.*)\/$/gm
    for (const [_, key, value] of okuriAri.matchAll(pattern)) {
      if (!key.includes("#")) {
        const candidates = value.split("/").map((_) => _.replace(/;.*$/, ""))
        this.#okuriAri.set(key, candidates);
      }
    }
    for (const [_, key, value] of okuriNasi.matchAll(pattern)) {
      if (!key.includes("#")) {
        const candidates = value.split("/").map((_) => _.replace(/;.*$/, ""))
        this.#okuriNasi.set(key, candidates);
      }
    }
  }
  convert(entry: string): Promise<string[]> {
    return Promise.resolve([
      ...this.#okuriAri.get(entry) ?? [],
      ...this.#okuriNasi.get(entry) ?? [],
    ]);
  }
  complete(entry: string): Promise<string[]> {
    return Promise.resolve(
      Array.from(this.#okuriNasi.keys())
        .filter((key) => key.startsWith(entry)),
    );
  }
}
