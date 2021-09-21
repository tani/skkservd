interface QuitRequest {
  type: "0";
}
interface ConversionRequest {
  type: "1";
  body: string;
}
interface VersionRequest {
  type: "2";
}
interface InformationRequest {
  type: "3";
}
interface CompletionRequest {
  type: "4";
  body: string;
}

export type Request =
  | QuitRequest
  | ConversionRequest
  | VersionRequest
  | InformationRequest
  | CompletionRequest;

export function parse(str: string): Request {
  let request: Request;
  let body: string | undefined;
  const type = str.at(0);
  switch (type) {
    case "1":
    case "4":
      body = str.slice(1).trim();
      if (!body) throw Error(`request entry is empty (${str})`);
      request = { type, body };
      break;
    case "0":
    case "2":
    case "3":
      request = { type };
      break;
    default:
      throw Error(`request type is invalid (${str})`);
  }
  return request;
}
