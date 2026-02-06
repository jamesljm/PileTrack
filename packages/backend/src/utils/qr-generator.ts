/**
 * Generates a simple SVG QR code placeholder.
 * In production, replace with a proper QR library (e.g., qrcode).
 */
export function generateQRCode(data: string): string {
  // Simple deterministic pattern based on data hash for visual distinction
  const hash = simpleHash(data);
  const size = 21; // QR version 1 is 21x21 modules
  const moduleSize = 10;
  const totalSize = size * moduleSize;
  const modules: boolean[][] = [];

  // Generate deterministic pattern
  for (let row = 0; row < size; row++) {
    modules[row] = [];
    for (let col = 0; col < size; col++) {
      // Finder patterns (top-left, top-right, bottom-left)
      if (isFinderPattern(row, col, size)) {
        modules[row][col] = true;
      } else if (isFinderBorder(row, col, size)) {
        modules[row][col] = false;
      } else {
        // Data area - use hash-based pattern
        const bit = (hash >> ((row * size + col) % 32)) & 1;
        modules[row][col] = bit === 1 || (row + col) % 3 === 0;
      }
    }
  }

  let rects = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row][col]) {
        rects += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#000"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">
  <rect width="${totalSize}" height="${totalSize}" fill="#fff"/>
  ${rects}
</svg>`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function isFinderPattern(row: number, col: number, size: number): boolean {
  // Top-left finder
  if (row < 7 && col < 7) {
    if (row === 0 || row === 6 || col === 0 || col === 6) return true;
    if (row >= 2 && row <= 4 && col >= 2 && col <= 4) return true;
  }
  // Top-right finder
  if (row < 7 && col >= size - 7) {
    const c = col - (size - 7);
    if (row === 0 || row === 6 || c === 0 || c === 6) return true;
    if (row >= 2 && row <= 4 && c >= 2 && c <= 4) return true;
  }
  // Bottom-left finder
  if (row >= size - 7 && col < 7) {
    const r = row - (size - 7);
    if (r === 0 || r === 6 || col === 0 || col === 6) return true;
    if (r >= 2 && r <= 4 && col >= 2 && col <= 4) return true;
  }
  return false;
}

function isFinderBorder(row: number, col: number, size: number): boolean {
  // Separator regions around finder patterns
  if ((row === 7 && col < 8) || (row < 8 && col === 7)) return true;
  if ((row === 7 && col >= size - 8) || (row < 8 && col === size - 8)) return true;
  if ((row === size - 8 && col < 8) || (row >= size - 8 && col === 7)) return true;
  return false;
}
