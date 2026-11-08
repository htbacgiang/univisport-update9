import { GetServerSideProps } from "next";
import db from "../utils/db";
import Product from "../models/Product";
import { SITE_URL, pickLastmod, urlEntry, urlset } from "../lib/sitemap";
import { PRODUCT_SLUG_FIXES, publicSlug } from "../lib/slugFixes";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    const products = await Product.find({})
      .select("slug updatedAt createdAt")
      .lean();

    const entries = (products as any[])
      .filter((p) => p.slug)
      .map((p) =>
        urlEntry(
          `${SITE_URL}/san-pham/${publicSlug(PRODUCT_SLUG_FIXES, p.slug)}`,
          pickLastmod(p.updatedAt, p.createdAt)
        )
      );

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=1800"
    );
    res.end(urlset(entries));
  } catch (error) {
    console.error("❌ Error generating sitemap-products.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapProducts() {
  return null;
}
