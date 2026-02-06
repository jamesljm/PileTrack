/**
 * Formats a date value into a human-readable string.
 *
 * @param date   - The date to format (string, Date, number timestamp)
 * @param locale - BCP 47 locale string (defaults to "en-GB")
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string, or empty string if input is falsy
 *
 * @example
 * ```ts
 * formatDate("2024-06-15T10:30:00Z");
 * // => "15/06/2024"
 *
 * formatDate("2024-06-15", "en-US", { dateStyle: "long" });
 * // => "June 15, 2024"
 * ```
 */
export function formatDate(
  date: string | Date | number | null | undefined,
  locale: string = "en-GB",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
): string {
  if (!date) return "";
  try {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return "";
  }
}

/**
 * Formats a number as a currency string.
 *
 * @param amount   - The numeric amount to format
 * @param currency - ISO 4217 currency code (defaults to "HKD")
 * @param locale   - BCP 47 locale string (defaults to "en-HK")
 * @returns Formatted currency string, or empty string if input is falsy
 *
 * @example
 * ```ts
 * formatCurrency(12500.5);
 * // => "HK$12,500.50"
 *
 * formatCurrency(1000, "USD", "en-US");
 * // => "$1,000.00"
 * ```
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "HKD",
  locale: string = "en-HK",
): string {
  if (amount === null || amount === undefined) return "";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

/**
 * Formats a number with locale-aware grouping and decimal separators.
 *
 * @param value            - The number to format
 * @param decimalPlaces    - Number of decimal places (defaults to 2)
 * @param locale           - BCP 47 locale string (defaults to "en-GB")
 * @returns Formatted number string, or empty string if input is falsy
 *
 * @example
 * ```ts
 * formatNumber(1234567.891);
 * // => "1,234,567.89"
 *
 * formatNumber(42.1, 0);
 * // => "42"
 * ```
 */
export function formatNumber(
  value: number | null | undefined,
  decimalPlaces: number = 2,
  locale: string = "en-GB",
): string {
  if (value === null || value === undefined) return "";
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Truncates a string to the specified length and appends an ellipsis if needed.
 *
 * @param str       - The string to truncate
 * @param maxLength - Maximum allowed length (defaults to 100)
 * @param suffix    - String to append when truncated (defaults to "...")
 * @returns The truncated string
 *
 * @example
 * ```ts
 * truncateString("Hello, World!", 5);
 * // => "Hello..."
 *
 * truncateString("Hi", 10);
 * // => "Hi"
 * ```
 */
export function truncateString(
  str: string | null | undefined,
  maxLength: number = 100,
  suffix: string = "...",
): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
}
