import { parse } from "./request.ts";
import { Dictionary } from "./dictionary.ts";
import { Handler } from "./handler.ts";
import * as log from "std/log/mod.ts";
import { json } from "./util.ts"

export class Server {
  #dictionary: Dictionary;
  #connections: Deno.Conn[];
  listener: Deno.Listener | undefined;
  constructor(dictionary: Dictionary) {
    this.#dictionary = dictionary;
    this.#connections = [];
  }
  async #process(connection: Deno.Conn) {
    while (this.#connections.includes(connection)) {
      const rawRequest = new Uint8Array(2 ^ 10);
      await connection.read(rawRequest);
      const decoder = new TextDecoder();
      const handler = new Handler(this.#dictionary);
      const requestStr = decoder.decode(rawRequest).replace(/\0.*$/s, "");
      log.debug(json`requestStr is ${requestStr}`)
      let request: ReturnType<typeof parse>;
      try {
        request = parse(requestStr);
        log.debug(json`request is ${request}`)
      } catch (error) {
        log.error(error)
        this.#connections = this.#connections.filter((c) => c !== connection);
        connection.close();
        break;
      }
      const response = await handler.handle(request);
      log.debug(json`response is ${response}`)
      if (response.type === "0") {
        this.#connections = this.#connections.filter((c) => c !== connection);
        connection.close();
        break;
      } else {
        const encoder = new TextEncoder();
        const responseStr = response.body;
        log.debug(json`responseStr is ${responseStr}`)
        const rawResponse = encoder.encode(responseStr);
        await connection.write(rawResponse);
      }
    }
  }
  async listen(options: Deno.ListenOptions) {
    log.info(json`listening on ${options.port}`)
    this.listener = Deno.listen(options);
    for await (const connection of this.listener) {
      log.debug(json`accpet connection ${connection.rid}`)
      this.#connections.push(connection);
      this.#process(connection);
    }
  }
}
