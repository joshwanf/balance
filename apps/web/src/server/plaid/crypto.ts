import "server-only"
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"
import config from "../config"

// Stored format: "v1:<iv>:<auth tag>:<ciphertext>", each part base64
const VERSION = "v1"
const IV_BYTES = 12

const key = () => {
  const raw = config.plaid?.tokenKey
  if (!raw) throw new Error("PLAID_TOKEN_KEY is not set")
  const buf = Buffer.from(raw, "base64")
  if (buf.length !== 32) {
    throw new Error("PLAID_TOKEN_KEY must be 32 bytes, base64-encoded")
  }
  return buf
}

/** Encrypts a Plaid access token with AES-256-GCM for storage. */
export const encryptToken = (plaintext: string): string => {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv("aes-256-gcm", key(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  return [VERSION, iv, cipher.getAuthTag(), ciphertext]
    .map(part => (typeof part === "string" ? part : part.toString("base64")))
    .join(":")
}

/** Decrypts a token made by encryptToken. Throws if it was tampered with. */
export const decryptToken = (stored: string): string => {
  const [version, iv, tag, ciphertext] = stored.split(":")
  if (version !== VERSION || !iv || !tag || !ciphertext) {
    throw new Error("Unrecognised access token format")
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(iv, "base64"),
  )
  decipher.setAuthTag(Buffer.from(tag, "base64"))
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8")
}
