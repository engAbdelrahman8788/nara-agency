type PdfMetric = { label: string; value: string };

type PdfInput = {
  filename: string;
  title: string;
  subtitle: string;
  metrics: PdfMetric[];
  summary: string;
  bullets: string[];
};

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "");
}

function wrapText(text: string, maxChars = 82) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    if ((current + word).length > maxChars) {
      if (current) lines.push(current.trim());
      current = `${word} `;
    } else {
      current += `${word} `;
    }
  });
  if (current.trim()) lines.push(current.trim());
  return lines;
}

export function downloadReportPdf({ filename, title, subtitle, metrics, summary, bullets }: PdfInput) {
  const commands: string[] = [];
  const text = (font: "F1" | "F2", size: number, x: number, y: number, value: string, gray = 0) => {
    commands.push(`BT /${font} ${size} Tf ${gray} ${gray} ${gray} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(value)}) Tj ET`);
  };

  commands.push("0.976 0.976 0.969 rg 0 0 612 792 re f");
  commands.push("0.0 0.294 1.0 rg 0 752 612 40 re f");
  text("F1", 11, 44, 768, "NARA / GROWTH INTELLIGENCE", 1);
  text("F2", 9, 486, 768, "CONFIDENTIAL", 1);

  text("F1", 28, 44, 694, title, 0.04);
  text("F2", 11, 44, 675, subtitle, 0.4);
  commands.push("0.85 0.85 0.84 RG 1 w 44 656 m 568 656 l S");

  let y = 622;
  metrics.forEach((metric, index) => {
    const x = 44 + index * 134;
    text("F2", 8, x, y, metric.label.toUpperCase(), 0.45);
    text("F1", 18, x, y - 23, metric.value, 0.08);
  });

  y -= 64;
  commands.push("0.0 0.294 1.0 rg 44 " + (y + 8) + " 3 22 re f");
  text("F1", 12, 58, y + 13, "Executive summary", 0.08);
  y -= 16;
  wrapText(summary).forEach((line) => {
    text("F2", 10, 44, y, line, 0.32);
    y -= 16;
  });

  y -= 18;
  text("F1", 12, 44, y, "What happened this month", 0.08);
  y -= 24;
  bullets.forEach((bullet) => {
    commands.push(`0.0 0.294 1.0 rg 44 ${y + 3} 4 4 re f`);
    wrapText(bullet, 76).forEach((line, index) => {
      text("F2", 10, (index === 0 ? 57 : 57), y, line, 0.3);
      y -= 16;
    });
    y -= 6;
  });

  commands.push("0.87 0.87 0.86 RG 1 w 44 82 m 568 82 l S");
  text("F2", 8, 44, 66, "Prepared by NARA. Questions? hello@nara.agency", 0.5);
  text("F2", 8, 488, 66, "nara.agency", 0.5);

  const stream = commands.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
