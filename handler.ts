import { Dictionary } from "./dictionary.ts";
import { Request } from "./request.ts";
import { Response } from "./response.ts";

export class Handler {
  #dictionary: Dictionary;
  constructor(dictionary: Dictionary) {
    this.#dictionary = dictionary;
  }
  async handle(request: Request): Promise<Response> {
    let candidates: string[];
    switch (request.type) {
      case "0":
        return { ...request };
      case "1":
        candidates = await this.#dictionary.convert(request.body);
        if (candidates.length === 0) {
          return { ...request, body: "4" + request.body + "\n" };
        }
        return { ...request, body: "1/" + candidates.join("/") + "/\n" };
      case "2":
        return { ...request, body: "0.0.0 " };
      case "3":
        return { ...request, body: "hostname:addr:...: " };
      case "4":
        candidates = await this.#dictionary.complete(request.body);
        if (candidates.length === 0) {
          return { ...request, body: "4" + request.body + "\n" };
        }
        return { ...request, body: "1/" + candidates.join("/") + "/\n" };
    }
  }
}
