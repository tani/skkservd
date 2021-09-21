import { parse } from "./request.ts";
import { Dictionary } from "./dictionary.ts";
import { Handler } from "./handler.ts";
import * as log from "std/log/mod.ts";
import { json } from "./util.ts";
import iconv from "iconv";

export class Server {
  #dictionary: Dictionary;
  #connections: Deno.Conn[];
  #encoding: string;
  #listener: Deno.Listener | undefined;
  constructor(dictionary: Dictionary, encording = "euc-jp") {
    this.#dictionary = dictionary;
    this.#connections = [];
    this.#encoding = encording;
  }
  async #process(connection: Deno.Conn) {
    while (this.#connections.includes(connection)) {
      const rawRequest = new Uint8Array(2 ^ 10);
      await connection.read(rawRequest);
      const handler = new Handler(this.#dictionary);
      const requestStr = iconv
        .decode(rawRequest, this.#encoding)
        .replace(/\0.*$/s, "");
      log.debug(json`requestStr is ${requestStr}`);
      let request: ReturnType<typeof parse>;
      try {
        request = parse(requestStr);
        log.debug(json`request is ${request}`);
      } catch (error) {
        log.error(error);
        this.#connections = this.#connections.filter((c) => c !== connection);
        connection.close();
        break;
      }
      const response = await handler.handle(request);
      log.debug(json`response is ${response}`);
      if (response.type === "0") {
        this.#connections = this.#connections.filter((c) => c !== connection);
        connection.close();
        break;
      } else {
        const responseStr = response.body;
        log.debug(json`responseStr is ${responseStr}`);
        const rawResponse = iconv.encode(responseStr, this.#encoding);
        await connection.write(rawResponse);
      }
    }
  }
  async listen(options: Deno.ListenOptions) {
    log.info(json`listening on ${options.port}`);
    this.#listener = Deno.listen(options);
    for await (const connection of this.#listener) {
      log.debug(json`accpet connection ${connection.rid}`);
      this.#connections.push(connection);
      this.#process(connection);
    }
  }
}
