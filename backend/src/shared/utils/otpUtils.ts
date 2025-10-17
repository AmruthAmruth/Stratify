export function generateOtp(length = 6): string {
  return Math.floor(
    10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
  ).toString();
}
