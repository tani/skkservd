import iconv from "iconv";

export interface Dictionary {
  convert(entry: string): Promise<string[]>;
  complete(entry: string): Promise<string[]>;
}

export class TextDictionary implements Dictionary {
  #okuriAri: Map<string, string[]> = new Map();
  #okuriNasi: Map<string, string[]> = new Map();
  async load(path: string, encording = "euc-jp"): Promise<void> {
    const blob = await Deno.readFile(path);
    const [okuriAri, okuriNasi] = iconv.decode(blob, encording).split(
      ";; okuri-nasi entries",
    );
    for (const match of okuriAri.matchAll(/^([^;].*) \/(.*)\/$/gm)) {
      const key = match[1];
      const value = match[2].split("/").map((c: string) =>
        c.replace(/;.*$/, "")
      );
      this.#okuriAri.set(key, value);
    }
    for (const match of okuriNasi.matchAll(/^([^;].*) \/(.*)\/$/gm)) {
      const key = match[1];
      const value = match[2].split("/").map((c: string) =>
        c.replace(/;.*$/, "")
      );
      this.#okuriNasi.set(key, value);
    }
  }
  get __debug() {
    return this.#okuriAri;
  }
  convert(entry: string): Promise<string[]> {
    return Promise.resolve([
      ...this.#okuriAri.get(entry) ?? [],
      ...this.#okuriNasi.get(entry) ?? [],
    ]);
  }
  complete(entry: string): Promise<string[]> {
    const cs: string[] = [];
    for (const key of this.#okuriNasi.keys()) {
      if (key.startsWith(entry)) {
        cs.push(key);
      }
    }
    return Promise.resolve(cs);
  }
}
