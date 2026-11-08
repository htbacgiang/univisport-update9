import { GetServerSideProps } from "next";
import db from "../utils/db";
import Post from "../models/Post";
import { SITE_URL, pickLastmod, urlEntry, urlset } from "../lib/sitemap";
import { postPath } from "../lib/slugFixes";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    // Bài viết 3 cấp: /bai-viet/[slug]
    const posts = await Post.find({
      isDraft: { $ne: true },
      isDirectPost: { $ne: true },
    })
      .select("slug isDirectPost updatedAt createdAt")
      .lean();

    // Bài viết 2 cấp (landing page): /[slug]
    const directPosts = await Post.find({
      isDraft: { $ne: true },
      isDirectPost: true,
    })
      .select("slug isDirectPost updatedAt createdAt")
      .lean();

    // postPath(): /bai-viet/[slug] (kể cả bài đã chuyển khỏi cấp gốc, slug đã sửa lỗi gõ) hoặc /[slug]
    const entries = [...(posts as any[]), ...(directPosts as any[])]
      .filter((p) => p.slug)
      .map((p) => urlEntry(`${SITE_URL}${postPath(p)}`, pickLastmod(p.updatedAt, p.createdAt)));

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=1800"
    );
    res.end(urlset(entries));
  } catch (error) {
    console.error("❌ Error generating sitemap-posts.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapPosts() {
  return null;
}
