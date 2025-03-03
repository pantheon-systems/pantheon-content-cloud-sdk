// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
export async function digestMessage(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return hash;
}
