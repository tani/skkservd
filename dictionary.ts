import iconv from "iconv";

export interface Dictionary {
  convert(entry: string): Promise<string[]>;
  complete(entry: string): Promise<string[]>;
}

export class TextDictionary implements Dictionary {
  #table: Map<string, string[]> = new Map();
  async load(path: string, encording = "euc-jp"): Promise<void> {
    const blob = await Deno.readFile(path);
    const src = iconv.decode(blob, encording);
    for (const match of src.matchAll(/^([^;].*) \/(.*)\/$/gm)) {
      const key = match[1];
      const value = match[2].split("/").map((c: string) =>
        c.replace(/;.*$/, "")
      );
      this.#table.set(key, value);
    }
  }
  get __debug() {
    return this.#table;
  }
  convert(entry: string): Promise<string[]> {
    return new Promise((resolve) => resolve(this.#table.get(entry) ?? []));
  }
  complete(entry: string): Promise<string[]> {
    const cs: string[] = [];
    for (const key of this.#table.keys()) {
      if (key.startsWith(entry)) {
        cs.push(key);
      }
    }
    return new Promise((resolve) => resolve(cs));
  }
}
