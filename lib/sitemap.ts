// Helper dùng chung cho các sitemap XML.
// Quy tắc (SEO 09/11/2026):
//  - <lastmod> chỉ lấy từ timestamp thật của dữ liệu (updatedAt → publishedAt → createdAt).
//    Không có timestamp hợp lệ → bỏ hẳn <lastmod>, KHÔNG dùng new Date() (thời điểm build/request).
//  - Không xuất <priority> / <changefreq> (Google bỏ qua, chỉ gây nhiễu).

export const SITE_URL = "https://dongphucunivi.com";

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
}

/** Trả về ISO string của timestamp hợp lệ đầu tiên, hoặc null nếu không có. */
export function pickLastmod(...candidates: unknown[]): string | null {
  for (const value of candidates) {
    if (value === null || value === undefined || value === "") continue;
    const date = value instanceof Date ? value : new Date(value as string | number);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return null;
}

export function urlEntry(loc: string, lastmod?: string | null): string {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ""}
  </url>`;
}

export function urlset(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join("")}
</urlset>`;
}
