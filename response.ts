interface QuitResponse {
  type: "0";
}
interface ConversionResponse {
  type: "1";
  body: string;
}
interface VersionResponse {
  type: "2";
  body: string;
}
interface InformationResponse {
  type: "3";
  body: string;
}
interface CompletionResponse {
  type: "4";
  body: string;
}

export type Response =
  | QuitResponse
  | ConversionResponse
  | VersionResponse
  | InformationResponse
  | CompletionResponse;
