import { randomBytes } from "crypto";

export function stringToUInt8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function uint8ArrayToString(data: Uint8Array): string {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(data);
}

export function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export function base64URLDecode(base64UrlString: string): Buffer {
  return Buffer.from(
    base64UrlString.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );
}

export function generateAppId(): number {
  const randomBytesBuffer = randomBytes(2);
  const randomValue = randomBytesBuffer.readUInt16BE(0);
  return (randomValue % 9000) + 1000;
}
