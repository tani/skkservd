import { Dictionary } from "./dictionary.ts";
import * as R from "rambda";
import * as JpNum from "jpnum";
import iconv from "iconv";

function toZenkaku(n: number): string {
  return n.toString().replaceAll(/[0-9]/g, (c): string => {
    const zenkakuNumbers = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
    return zenkakuNumbers[parseInt(c)];
  });
}
function toKanjiModern(n: number): string {
  return n.toString().replaceAll(/[0-9]/g, (c): string => {
    const kanjiNumbers = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return kanjiNumbers[parseInt(c)];
  });
}
const toKanjiClassic: (n: number) => string = JpNum.number2kanji;

export function convertNumber(pattern: string, entry: string): string {
  return R.zip(pattern.split(/(#[0-9]?)/g), entry.split(/([0-9]+)/g))
    .map(([k, e]) => {
      switch (k) {
        case "#":
        case "#0":
        case "#4":
        case "#5":
        case "#6":
        case "#7":
        case "#8":
        case "#9":
          return e;
        case "#1":
          return toZenkaku(parseInt(e));
        case "#2":
          return toKanjiModern(parseInt(e));
        case "#3":
          return toKanjiClassic(parseInt(e));
        default:
          return k;
      }
    })
    .join("");
}

export class NumericDictionary implements Dictionary {
  #okuriAri: Map<string, string[]> = new Map();
  #okuriNasi: Map<string, string[]> = new Map();
  async load(
    path: Parameters<typeof Deno.readFile>[0],
    encording = "euc-jp",
  ): Promise<void> {
    const blob = await Deno.readFile(path);
    const [okuriAri, okuriNasi] = iconv.decode(blob, encording)
      .split(";; okuri-nasi entries") as [string, string];
    const pattern = /^(?<!;)(.*) \/(.*)\/$/gm
    for (const [_, key, value] of okuriAri.matchAll(pattern)) {
      if (key.includes("#")) {
        const candidates = value.split("/").map((_) => _.replace(/;.*$/, ""))
        this.#okuriAri.set(key, candidates);
      }
    }
    for (const [_, key, value] of okuriNasi.matchAll(pattern)) {
      if (key.includes("#")) {
        const candidates = value.split("/").map((_) => _.replace(/;.*$/, ""))
        this.#okuriNasi.set(key, candidates);
      }
    }
  }
  convert(entry: string): Promise<string[]> {
    return Promise.resolve([
      ...this.#okuriAri.get(entry.replaceAll(/[0-9]+/g, "#")) ?? [],
      ...this.#okuriNasi.get(entry.replaceAll(/[0-9]+/g, "#")) ?? [],
    ].map((value) => convertNumber(value, entry)));
  }
  complete(entry: string): Promise<string[]> {
    return Promise.resolve(
      [...this.#okuriAri.keys(), ...this.#okuriNasi.keys()]
        .filter((key) => key.startsWith(entry.replaceAll(/[0-9]+/g, "#")))
        .map((key) => convertNumber(key, entry)),
    );
  }
}
