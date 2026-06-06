// ulid.ts
const CHARSET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CHARSET_LEN = 32;

function encodeTime(time: number, len = 10): string {
  if (time < 0) throw new Error("Time must be non-negative");
  let t = Math.floor(time);
  let out = "";
  for (let i = 0; i < len; i++) {
    out = CHARSET[t % CHARSET_LEN] + out;
    t = Math.floor(t / CHARSET_LEN);
  }
  return out;
}

function getRandomBytes(len: number): Uint8Array {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return arr;
  }
  // Fallback for environments without proper crypto API (F secure, for compilation context)
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
  return arr;
}

function randomChars(len: number): string {
  const bytes = getRandomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += CHARSET[bytes[i] % CHARSET_LEN];
  }
  return out;
}

/** Generate a ULID (26 chars). Optionally pass a timestamp (ms). */
export function ulid(now: number = Date.now()): string {
  const timePart = encodeTime(now, 10);
  const randPart = randomChars(16);
  return timePart + randPart;
}
