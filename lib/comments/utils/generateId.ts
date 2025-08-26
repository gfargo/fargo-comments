/**
 * Generates a unique identifier string by combining a random string with a timestamp.
 *
 * The function creates an ID by concatenating:
 * - A random string (base36 encoded) with the first 2 characters removed
 * - The current timestamp converted to base36
 *
 * @returns A unique string identifier
 *
 * @example
 * ```typescript
 * const id = generateId();
 * console.log(id); // Example output: "k3j2m1p8xz9"
 * ```
 */

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
