import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatInTimeZone } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDate(): string {
  const now = new Date();
  // const offset = 7 * 60 * 60 * 1000;
  // const offsetToday = new Date(now.getTime() + offset);

  const offsetToday = new Date(now.getTime());
  return offsetToday.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// export function getOffsetDateAndTime(offsetInHours = 7): Date {
//   const now = new Date();
//   const offsetMs = offsetInHours * 60 * 60 * 1000;
//   return new Date(now.getTime() + offsetMs);
// }

// + 24 * 60 * 60 * 1000

export function getOffsetDateAndTime(offsetInHours = 0): Date {
  const now = new Date();
  const offsetMs = offsetInHours * 60 * 60 * 1000;
  return new Date(now.getTime() + offsetMs);
}

export function formatTimeJakarta(date: Date): string {
  return formatInTimeZone(date, 'Asia/Jakarta', 'HH:mm:ss');
}
