import { GetServerSideProps } from "next";
import { SITE_URL, urlEntry, urlset } from "../lib/sitemap";

// Danh sách URL danh mục đã đối chiếu với SEO Audit 07/11/2026 (+ /dong-phuc-ao-thun 09/11/2026).
// Trang danh mục không có timestamp sửa đổi thật → không xuất <lastmod>.
const categories = [
  // Đồng phục thể thao
  "dong-phuc-the-thao",
  "dong-phuc-gym",
  "dong-phuc-yoga",
  "dong-phuc-pilates",
  "dong-phuc-pickleball",
  "dong-phuc-ao-gio",
  "dong-phuc-chay-bo",
  "dong-phuc-golf-tennis",
  "dong-phuc-mma",
  "dong-phuc-ao-thun",

  // Đồng phục doanh nghiệp
  "dong-phuc-doanh-nghiep",
  "dong-phuc-polo",
  "dong-phuc-so-mi",
  "dong-phuc-vest-cong-so",
  "dong-phuc-teambuilding",
  "bao-ho-lao-dong",
  "phu-kien-qua-tang-doanh-nghiep",
] as const;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.statusCode = 200;
  res.end(urlset(categories.map((slug) => urlEntry(`${SITE_URL}/${slug}`))));

  return { props: {} };
};

export default function SitemapCategories() {
  return null;
}
