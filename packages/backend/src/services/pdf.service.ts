import { logger } from "../config/logger";

/**
 * PDF report generation service.
 * In production, integrate a proper PDF library (e.g., pdfkit, puppeteer, or @react-pdf/renderer).
 */
class PdfService {
  async generateReport(data: {
    title: string;
    content: Record<string, unknown>;
    format?: "A4" | "LETTER";
  }): Promise<Buffer> {
    logger.info({ title: data.title }, "Generating PDF report");

    // Create a simple text-based PDF placeholder
    // In production, use a real PDF library
    const textContent = [
      `%PDF-1.4`,
      `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj`,
      `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj`,
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj`,
      `5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj`,
    ];

    const lines = [
      `BT`,
      `/F1 24 Tf`,
      `72 720 Td`,
      `(${escapeParens(data.title)}) Tj`,
      `/F1 12 Tf`,
      `0 -30 Td`,
      `(Generated: ${new Date().toISOString()}) Tj`,
      `0 -20 Td`,
      `(PileTrack Report) Tj`,
    ];

    // Add content fields
    let yOffset = -30;
    for (const [key, value] of Object.entries(data.content)) {
      lines.push(`0 ${yOffset} Td`);
      lines.push(`(${escapeParens(key)}: ${escapeParens(String(value))}) Tj`);
      yOffset = -16;
    }

    lines.push(`ET`);

    const stream = lines.join("\n");
    textContent.push(
      `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream\nendobj`,
    );

    const body = textContent.join("\n");
    const xref = `xref\n0 6\n0000000000 65535 f \n`;
    const trailer = `trailer<</Size 6/Root 1 0 R>>\nstartxref\n${body.length}\n%%EOF`;
    const pdf = `${body}\n${xref}${trailer}`;

    return Buffer.from(pdf, "utf-8");
  }
}

function escapeParens(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export const pdfService = new PdfService();
