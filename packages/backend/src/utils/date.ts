/**
 * Convert a date to UTC.
 */
export function toUTC(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds(),
    ),
  );
}

/**
 * Format a date to ISO 8601 string.
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Check if a value is a valid date.
 */
export function isValidDate(value: unknown): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return !isNaN(d.getTime());
  }
  return false;
}

/**
 * Get the start of day in UTC.
 */
export function startOfDayUTC(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of day in UTC.
 */
export function endOfDayUTC(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}
