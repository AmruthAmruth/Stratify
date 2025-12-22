import bcrypt from "bcryptjs";
import crypto from "crypto";

export const comparePassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

/**
 * Generates a cryptographically secure random password
 * @param length - Length of the password (default: 12)
 * @returns A random password string
 */
export function generateRandomPassword(length: number = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  // Use crypto.randomBytes for cryptographically secure random generation
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    // Use modulo to map random bytes to character indices
    password += chars[randomBytes[i] % chars.length];
  }

  return password;
}
