// Sửa slug gõ nhầm (SEO 09/11/2026). File CommonJS để dùng chung cho next.config.js và các trang.
// key = slug sai (đang lưu trong DB), value = slug đúng (URL công khai).
//
// Cách hoạt động — an toàn bất kể thứ tự deploy / đổi DB:
//  1. next.config.js: 301 slug sai → slug đúng.
//  2. Trang chi tiết: nếu không tìm thấy slug đúng trong DB, tra ngược sang slug sai (alias).
//  3. Sitemap: luôn xuất slug đúng.
// Sau khi đã đổi slug trong DB sang slug đúng, alias ở bước 2 tự hết tác dụng; giữ redirect ở bước 1.

const PRODUCT_SLUG_FIXES = {
  // "aplapl01" lặp mã: các SP cùng dòng dùng apl02…apl16
  "ao-polo-pickleball-univi-aplapl01": "ao-polo-pickleball-univi-apl01",
};

const POST_SLUG_FIXES = {
  // "unvi" → "univi"
  "ao-tap-gym-duong-tran-unvi": "ao-tap-gym-duong-tran-univi",
};

// Bài viết dạng blog trước đây phục vụ ở cấp gốc (/[slug], isDirectPost) → chuyển về /bai-viet/[slug]
// với 301 (09/11/2026). Các trang thương hiệu (founder, xưởng, UNI DRY, landing) vẫn giữ ở cấp gốc.
// Có thể tắt cờ isDirectPost cho các bài này trong dashboard; code vẫn đúng dù đã tắt hay chưa.
const POSTS_MOVED_TO_BLOG = [
  "vai-super-cool-la-gi",
  "20-mau-quan-ao-tap-yoga-dep-cho-nu",
  "dong-phuc-pt-chuyen-nghiep-giai-phap-xay-dung-hinh-anh-huan-luyen-vien-hien-dai",
  "dong-phuc-phong-tap-chuyen-nghiep-cho-gym-fitness",
];

/** Bài này có được phục vụ ở cấp gốc /[slug] không. */
const isRootPost = (post) =>
  Boolean(post && post.isDirectPost) && !POSTS_MOVED_TO_BLOG.includes(post.slug);

/** Đường dẫn công khai của một bài viết: "/slug" hoặc "/bai-viet/slug". */
const postPath = (post) =>
  isRootPost(post) ? `/${post.slug}` : `/bai-viet/${publicSlug(POST_SLUG_FIXES, post.slug)}`;

const invert = (map) =>
  Object.fromEntries(Object.entries(map).map(([wrong, right]) => [right, wrong]));

/** Slug công khai cho một slug trong DB. */
const publicSlug = (map, slug) => map[slug] || slug;

/** Các slug cần thử trong DB cho một slug công khai (slug đúng trước, rồi slug sai cũ). */
const dbSlugCandidates = (map, slug) => {
  const legacy = invert(map)[slug];
  return legacy ? [slug, legacy] : [slug];
};

module.exports = {
  PRODUCT_SLUG_FIXES,
  POST_SLUG_FIXES,
  POSTS_MOVED_TO_BLOG,
  isRootPost,
  postPath,
  publicSlug,
  dbSlugCandidates,
};
