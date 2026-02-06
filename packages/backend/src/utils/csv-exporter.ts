/**
 * Convert an array of data rows to a CSV string.
 */
export function arrayToCsv(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
): string {
  const escapeCsvField = (field: string | number | boolean | null | undefined): string => {
    if (field === null || field === undefined) {
      return "";
    }
    const str = String(field);
    // Escape fields containing commas, quotes, or newlines
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));

  return [headerLine, ...dataLines].join("\r\n") + "\r\n";
}
