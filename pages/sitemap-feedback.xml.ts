import { GetServerSideProps } from "next";
import db from "../utils/db";
import Feedback from "../models/Feedback";
import { SITE_URL, pickLastmod, urlEntry, urlset } from "../lib/sitemap";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    const feedbacks = await Feedback.find({})
      .select("slug updatedAt createdAt")
      .lean();

    const entries = (feedbacks as any[])
      .filter((f) => f.slug)
      .map((f) =>
        urlEntry(`${SITE_URL}/feedback/${f.slug}`, pickLastmod(f.updatedAt, f.createdAt))
      );

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=3600"
    );
    res.end(urlset(entries));
  } catch (error) {
    console.error("❌ Error generating sitemap-feedback.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapFeedback() {
  return null;
}
