import "server-only"
import bcrypt from "bcryptjs"

const ROUNDS = 12

export const hashPassword = (password: string) => bcrypt.hash(password, ROUNDS)

/** Bcrypt hashes start with $2; anything else is a legacy plaintext row. */
export const isHashed = (stored: string) => /^\$2[aby]\$/.test(stored)

export const verifyPassword = async (password: string, stored: string) => {
  if (isHashed(stored)) return bcrypt.compare(password, stored)
  return password.length > 0 && password === stored
}
