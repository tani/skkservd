import { Dictionary } from "./dictionary.ts";
import { SKKRequest } from "./request.ts";
import { SKKResponse } from "./response.ts";

export class Handler {
  #dictionary: Dictionary;
  constructor(dictionary: Dictionary) {
    this.#dictionary = dictionary;
  }
  async handle(request: SKKRequest): Promise<SKKResponse> {
    switch (request.type) {
      case "0":
        return {
          type: request.type,
        };
      case "1":
        return {
          type: request.type,
          body:
            "1/" +
            (await this.#dictionary.convert(request.body))
              .map((w) => w + "/")
              .join("") +
            "\n",
        };
      case "2":
        return {
          type: request.type,
          body: "0.0.0 ",
        };
      case "3":
        return {
          type: request.type,
          body: "hostname:addr:...: ",
        };
      case "4":
        return {
          type: request.type,
          body:
            "4/" +
            (await this.#dictionary.complete(request.body))
              .map((w) => w + "/")
              .join("") +
            "\n",
        };
    }
  }
}
