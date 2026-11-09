// Tiện ích dùng chung cho trang sản phẩm. Dùng ở: pages/san-pham/[slug] (robots),
// pages/sitemap-products.xml.ts (loại URL noindex), pages/san-pham (hub) và
// ProductDetailView (ẩn khối "Chi tiết sản phẩm"). Sửa ở đây là đổi đồng loạt.

/**
 * Sản phẩm có nội dung chi tiết thật hay không.
 * HTML rỗng như "<p><br></p>" hoặc toàn &nbsp; được coi là KHÔNG có nội dung.
 */
export function hasProductDetailContent(html) {
  if (!html || typeof html !== "string") return false;
  if (/<(img|iframe|video|table)\b/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").trim().length > 0;
}

/** Cắt mô tả về tối đa `max` ký tự, ngắt ở ranh giới từ, thêm "…" khi bị cắt. */
export function truncateMetaDescription(text, max = 155) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}

/** Chuỗi ASCII an toàn cho SKU: bỏ dấu tiếng Việt, đ→d, IN HOA, nối bằng "-". */
export function toSkuToken(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toUpperCase();
}
