export interface Dictionary {
  convert(entry: string): Promise<string[]>;
  complete(entry: string): Promise<string[]>;
}

export class CombinedDictionary implements Dictionary {
  #dictionaries: Dictionary[]
  constructor(...dictionares: Dictionary[]) {
    this.#dictionaries = dictionares
  }
  async convert(entry: string): Promise<string[]> {
    return ([] as string[]).concat(
      ...await Promise.all(this.#dictionaries.map(_ => _.convert(entry)))
    )
  }
  async complete(entry: string): Promise<string[]> {
    return ([] as string[]).concat(
      ...await Promise.all(this.#dictionaries.map(_ => _.complete(entry)))
    )
  }
}

