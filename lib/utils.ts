import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/**
 * Formats a date into a human-readable "time ago" string.
 *
 * @param date - The date to format
 * @returns A formatted string representing the time elapsed since the given date:
 *   - "just now" for times less than 1 minute ago
 *   - "Xm ago" for times less than 1 hour ago
 *   - "Xh ago" for times less than 1 day ago
 *   - "Xd ago" for times less than 1 week ago
 *   - Localized date string for times 1 week or older
 *
 * @example
 * ```typescript
 * const now = new Date();
 * const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
 * formatTimeAgo(fiveMinutesAgo); // "5m ago"
 * ```
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
