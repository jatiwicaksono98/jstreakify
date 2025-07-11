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

export function getAgeFromNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return `${days}d ${hours}hrs`;
}

export function formatFullDateTimeIndo(date: Date): string {
  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });

  const parts = formatter.formatToParts(date);

  const day = parts.find((p) => p.type === 'day')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const year = parts.find((p) => p.type === 'year')?.value;
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;

  return `${day} ${month} ${year} at ${hour}.${minute} WIB`;
}
