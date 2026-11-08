import { GetServerSideProps } from "next";
import { SITE_URL, urlEntry, urlset } from "../lib/sitemap";

// Trang tĩnh: không có timestamp sửa đổi thật → không xuất <lastmod>.
const pages = [
  "/",
  "/gioi-thieu",
  "/lien-he",
  "/san-pham",
  "/dang-ky-dai-ly",
  "/huong-dan-dat-hang",
  "/chinh-sach-bao-mat",
  "/chinh-sach-doi-tra",
  "/chinh-sach-bao-hanh",
  "/chinh-sach-dai-ly",
  "/dieu-khoan-su-dung",
  "/ho-so-nang-luc",
  "/tuyen-dung",
  "/giai-phap-2s",
  "/chat-lieu-vai",
  "/bang-mau",

  // Hub / landing (bổ sung 09/11/2026 — đều 200 + canonical tự trỏ)
  "/bai-viet",
  "/bo-suu-tap",
  "/feedback",
  "/mau-ao-gym-co-co-khoa",
  "/mau-ao-gym-co-polo",
  "/mau-ao-gym-co-tron-khong-khoa",
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.end(urlset(pages.map((path) => urlEntry(`${SITE_URL}${path}`))));

  return { props: {} };
};

export default function SitemapPages() {
  return null;
}
