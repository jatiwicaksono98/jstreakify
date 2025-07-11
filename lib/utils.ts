import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

/**
 * Merge Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get today's date in 'YYYY-MM-DD' format for Jakarta (UTC+7)
 */
export function getTodayDate(): string {
  return formatInTimeZone(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
}

/**
 * Get a Date object offset by given hours from now (default +7 for Jakarta)
 */
export function getOffsetDateAndTime(): Date {
  const now = new Date(); // current UTC timestamp
  return toZonedTime(now, 'Asia/Jakarta'); // returns a Date object "localized" to WIB
}

/**
 * Format a date into 'HH:mm:ss' in Jakarta local time
 */
export function formatTimeJakarta(date: Date): string {
  return formatInTimeZone(date, 'Asia/Jakarta', 'HH:mm:ss');
}
