import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DefaultLayout2 from "../components/layout/DefaultLayout2";
import BannerTTG from "../components/tantruonggiang/BannerTTG";
import BlogHero from "../components/profiles/BlogHero";
import FeedbackSection from "../components/profiles/FeedbackSection";
import PostCard from "../components/common/PostCard";
import { readPostsFromDb } from "../lib/utils";
import ProductSlider from "../components/univisport/ProductSlider";
import CategoryFeaturedProduct from "../components/univisport/CategoryFeaturedProduct";
import CategoryGrid from "../components/univisport/CategoryGrid";
import HeroSection1 from "../components/univisport/HeroSection1";
import PartnersSection from "../components/univisport/PartnersSection";
import FabricCatalogView from "../components/univisport/chat-lieu-vai/FabricCatalogView";
import VideoFeedback from "../components/univisport/VideoFeedback";
import { useInView } from "../hooks/useInView";
import db from "../utils/db";
import Product from "../models/Product";
import Feedback from "../models/Feedback";
import HomepageVideoFeedbackSettings from "../models/HomepageVideoFeedbackSettings";
import HomepageSection from "../models/HomepageSection";
import { DEFAULT_HOMEPAGE_FAQS, DEFAULT_CLOUDINARY_VIDEO } from "../data/homepageFaqs";
import { normalizeCategoryHref } from "../lib/siteCategories";
import { setPublicCacheHeaders } from "../lib/cacheControl";

// FAQComponent PHẢI SSR: JSON-LD FAQPage (pages/_app.js) dựng từ cùng mảng homepageFaqs,
// nên câu hỏi + câu trả lời phải có trong HTML server để khớp schema (tránh schema drift).
// window.AudioContext / iframe Facebook chỉ chạy trong event handler & useEffect → an toàn khi SSR.
const FAQComponent = dynamic(() => import("../components/univisport/FAQComponent"));

// CTABannerSection dùng window.location.pathname → không SSR được
const CTABannerSection = dynamic(
  () => import("../components/univisport/CTABanner"),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────
// META OBJECT mặc định — dùng khi getServerSideProps lỗi
// Tách ra ngoài để tránh duplicate code ở catch block
// ─────────────────────────────────────────────────────────────
const DEFAULT_META = {
  title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
  description: "Đồng Phục Univi – Tiên phong giải pháp đồng phục thể thao cho phòng Gym, Pilates, Pickleball và doanh nghiệp. Thiết kế miễn phí, sản xuất theo yêu cầu.",
  keywords:
    "đồng phục thể thao, đồng phục Gym, đồng phục Yoga, đồng phục Pilates, đồng phục Pickleball, đồng phục Áo Gió, đồng phục Áo Polo, đồng phục phòng tập, xưởng may đồng phục Hà Nội, công nghệ UNI DRY, đồng phục doanh nghiệp B2B, may đồng phục theo yêu cầu, Đồng Phục Univi",
  robots: "index, follow",
  author: "Đồng Phục Univi",
  canonical: "https://dongphucunivi.com/",
  og: {
    title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
    description: "Đồng Phục Univi – Tiên phong giải pháp đồng phục thể thao cho phòng Gym, Pilates, Pickleball và doanh nghiệp. Thiết kế miễn phí, sản xuất theo yêu cầu.",
    type: "website",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
    imageWidth: "1200",
    imageHeight: "630",
    imageAlt:
      "Xưởng sản xuất đồng phục thể thao Univi tại phường Chương Mỹ, Hà Nội - công suất 100.000 sản phẩm/tháng",
    url: "https://dongphucunivi.com/",
    site_name: "Đồng Phục Univi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
    description: "Đồng Phục Univi – Tiên phong giải pháp đồng phục thể thao cho phòng Gym, Pilates, Pickleball và doanh nghiệp. Thiết kế miễn phí, sản xuất theo yêu cầu.",

    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
  },
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://dongphucunivi.com/#webpage",
      "url": "https://dongphucunivi.com/",
      "name": "Đồng Phục Univi: Xưởng May Đồng Phục Thể Thao Tại Hà Nội",
      "description": "Đồng Phục Univi – Tiên phong giải pháp đồng phục thể thao cho phòng Gym, Pilates, Pickleball và doanh nghiệp. Thiết kế miễn phí, sản xuất theo yêu cầu.",
      "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
      "about": { "@id": "https://dongphucunivi.com/#organization" },
      "inLanguage": "vi-VN",
    },
  ],
};

export default function Home({
  posts = [],
  sections = [],
  homepageFaqs = [],
  initialFeedbacks = [],
  initialVideoFeedbacks = [],
  meta = DEFAULT_META,
}) {
  return (
    <DefaultLayout2>
      <BannerTTG />
      <div className="container mx-auto px-4">
        <CategoryGrid />
      </div>
      {sections.map((section) =>
        section.products.length > 0 ? (
          <div key={section._id}>
            {section.sectionBanner?.isVisible && section.sectionBanner?.image && (
              <SectionBanner banner={section.sectionBanner} />
            )}
            <ProductSlider
              title={section.title}
              products={section.products}
              viewAllLink={section.viewAllLink}
            />
            {section.featuredProduct && (
              <CategoryFeaturedProduct
                product={section.featuredProduct}
                sectionTitle={section.title}
              />
            )}
          </div>
        ) : null
      )}

      <VideoSection />
      <FeedbackSection initialFeedbacks={initialFeedbacks} />
      <PartnersSection />
      <HeroSection1 />
      <div className="container mx-auto px-2 sm:px-4 mb-6 sm:mb-10 mt-3">
        <FabricCatalogView />
      </div>
      <VideoFeedback initialItems={initialVideoFeedbacks} />
      <FAQComponent items={homepageFaqs} />
      <BlogHero />
      <div className="container mx-auto px-4 py-4 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <PostCard post={post} />
            </div>

          ))}
        </div>



        <div className="flex justify-center mt-6">
          <Link
            href="/bai-viet"
            className="group inline-flex items-center text-gray-700 font-medium transform hover:-translate-y-1 transition-all duration-300 hover:text-[#105d97]"
          >
            <span className="mr-3">Xem tất cả</span>

          </Link>
        </div>
      </div>

      <CTABannerSection />
    </DefaultLayout2>
  );
}

// ─────────────────────────────────────────────────────────────
// VIDEO SECTION
// ─────────────────────────────────────────────────────────────
const HOME_VIDEO_SRC = "/video-univi-2-baseline.mp4";

function VideoSection() {
  const videoRef = useRef(null);
  const isUserPausedRef = useRef(false);
  // Tải trước video khi khung video cách màn hình 400px
  const { ref: wrapperRef, isInView: shouldLoadVideo } = useInView({
    rootMargin: "400px 0px",
  });
  const [playing, setPlaying] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatVideoTime = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);
    return `${minutes}:${rest.toString().padStart(2, "0")}`;
  };

  // IntersectionObserver: Tự động phát video ngay khi cuộn tới màn hình
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    // Đảm bảo video ở chế độ tắt tiếng để trình duyệt luôn cho phép autoplay
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isUserPausedRef.current) {
            const promise = video.play();
            if (promise !== undefined) {
              promise
                .then(() => {
                  setPlaying(true);
                })
                .catch(() => {
                  video.muted = true;
                  setMuted(true);
                  video
                    .play()
                    .then(() => setPlaying(true))
                    .catch(() => setPlaying(false));
                });
            }
          }
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const updateDuration = () => {
      setDuration(video.duration || 0);
      updateTime();
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    if (video.readyState >= 1) updateDuration();

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      isUserPausedRef.current = false;
      setIsUserPaused(false);
      video.play().then(() => setPlaying(true)).catch(() => { });
    } else {
      isUserPausedRef.current = true;
      setIsUserPaused(true);
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    const value = Number(event.target.value);
    setProgress(value);

    if (!video || !video.duration) return;
    video.currentTime = (value / 100) * video.duration;
    setCurrentTime(video.currentTime);
  };

  return (
    <div ref={wrapperRef} className="container mx-auto mt-6 mb-2 px-4" style={{ position: "relative" }}>
      <div className="group" style={{ position: "relative", borderRadius: "8px", overflow: "hidden", background: "#0a0a0a" }}>
        <video
          ref={videoRef}
          src={shouldLoadVideo ? HOME_VIDEO_SRC : undefined}
          autoPlay
          muted={muted}
          loop
          playsInline
          preload={shouldLoadVideo ? "auto" : "none"}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={togglePlay}
          style={{ width: "100%", aspectRatio: "16 / 9", display: "block", cursor: "pointer", objectFit: "cover" }}
        />

        {!playing && isUserPaused && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Phát video"
            className="absolute inset-0 z-10 flex items-center justify-center border-0 bg-transparent p-0"
          >
            <span className="flex h-11 w-16 items-center justify-center rounded-xl bg-[#FF0000]/50 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </span>
          </button>
        )}

        {/* Controls overlay */}
        <div
          onClick={(event) => event.stopPropagation()}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 h-4">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/40">
              <div
                className="h-full bg-red-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="absolute bottom-0 h-3 w-3 translate-y-1/2 rounded-full bg-red-500 shadow"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onInput={handleSeek}
              onChange={handleSeek}
              aria-label="Tua video"
              className="absolute inset-x-0 bottom-[-6px] m-0 h-6 w-full cursor-pointer opacity-0"
            />
          </div>

          <div
            className="pointer-events-auto flex items-center gap-3 px-4 pb-5 pt-12"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.72))" }}
          >
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              aria-label={playing ? "Tạm dừng" : "Phát"}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              {playing ? (
                // Pause icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <rect x="5" y="3" width="4" height="18" rx="1" />
                  <rect x="15" y="3" width="4" height="18" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            {/* Mute / Unmute */}
            <button
              onClick={toggleMute}
              aria-label={muted ? "Bật tiếng" : "Tắt tiếng"}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.35)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
            >
              {muted ? (
                // Muted icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                // Sound icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>

            <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-white/80 sm:text-sm">
              {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION BANNER
// ─────────────────────────────────────────────────────────────
function BannerImg({ src, mobileSrc, alt, radius }) {
  return (
    <picture className="block">
      <source media="(max-width: 639px)" srcSet={mobileSrc} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={300}
        loading="lazy"
        className="block h-auto w-full"
        style={{ borderRadius: `${radius}px` }}
      />
    </picture>
  );
}

function SectionBanner({ banner }) {
  const radius = banner.borderRadius ?? 8;
  const mobileSrc = banner.mobileImage || banner.image;

  const content = (
    <div
      className="w-full overflow-hidden container mx-auto"
      style={{ borderRadius: `${radius}px` }}
    >
      <BannerImg
        src={banner.image}
        mobileSrc={mobileSrc}
        alt="banner"
        radius={radius}
      />
    </div>
  );

  return (
    <div className="container mx-auto mb-2 mt-3 ">
      {banner.link ? (
        <Link
          href={banner.link}
          className="block"
          aria-label="banner"
          {...(banner.openInNewTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </Link>
      ) : content}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAP PRODUCT — Strip unused fields to minimize __NEXT_DATA__ payload
// ─────────────────────────────────────────────────────────────
function mapProduct(product) {
  if (!product) return null;
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price);
  const originalPrice = typeof product.originalPrice === "number" ? product.originalPrice : parseFloat(product.originalPrice);
  const hasValidPrice = Number.isFinite(price) && price > 0;
  const hasOriginalPrice = Number.isFinite(originalPrice) && originalPrice > price;

  const item = {
    id: String(product.id || product._id || ""),
    name: product.name || "",
    slug: product.slug || "",
    image:
      product.colors && product.colors.length > 0 && product.colors[0].image
        ? product.colors[0].image
        : product.image || "",
    colors: Array.isArray(product.colors)
      ? product.colors.slice(0, 6).map((color) => ({
        name: color.name || "Màu",
        hex: color.hex || "#000000",
        hex2: color.hex2 || "",
        image: color.image || "",
      }))
      : [],
  };

  // Explicitly strip "price": 0 and omit falsy/zero prices as required by prompt
  if (hasValidPrice) {
    item.price = price;
    if (hasOriginalPrice) {
      item.maxPrice = originalPrice;
      item.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }
  }

  return item;
}

function mapFeaturedProduct(product) {
  if (!product) return null;
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price);
  const originalPrice = typeof product.originalPrice === "number" ? product.originalPrice : parseFloat(product.originalPrice);
  const hasValidPrice = Number.isFinite(price) && price > 0;
  const hasOriginalPrice = Number.isFinite(originalPrice) && originalPrice > price;

  const item = {
    id: String(product.id || product._id || ""),
    name: product.name || "",
    slug: product.slug || "",
    image:
      product.colors && product.colors.length > 0 && product.colors[0].image
        ? product.colors[0].image
        : product.image || "",
    // Strip HTML tags and long description content
    description: (product.description || "").replace(/<[^>]*>?/gm, "").slice(0, 160),
    colors: Array.isArray(product.colors)
      ? product.colors.slice(0, 8).map((color) => ({
        name: color.name || "Màu",
        hex: color.hex || "#000000",
        hex2: color.hex2 || "",
        image: color.image || "",
      }))
      : [],
    gallery: Array.isArray(product.gallery)
      ? product.gallery.map((g) => (typeof g === "string" ? g : g?.src || "")).filter(Boolean).slice(0, 8)
      : [],
    featuredConfig: product.featuredConfig
      ? {
        customTitle: product.featuredConfig.customTitle || "",
        customSubtitle: product.featuredConfig.customSubtitle || "",
        customDescription: product.featuredConfig.customDescription || "",
        customImage: product.featuredConfig.customImage || "",
        customSecondaryImage: product.featuredConfig.customSecondaryImage || "",
        videoUrl: product.featuredConfig.videoUrl || "",
        badgeText: product.featuredConfig.badgeText || "",
        soldCount: product.featuredConfig.soldCount || "",
        recentCustomers: product.featuredConfig.recentCustomers || "",
      }
      : null,
  };

  if (hasValidPrice) {
    item.price = price;
    if (hasOriginalPrice) {
      item.maxPrice = originalPrice;
      item.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }
  }

  return item;
}

// ─────────────────────────────────────────────────────────────
// FALLBACK SECTIONS & CORPORATE CATEGORY FILTER
// ─────────────────────────────────────────────────────────────
const SECTION_CATEGORY_ALIASES = {
  "dong-phuc-polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],
  "dong-phuc-ao-polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],
  "polo": ["dong-phuc-polo", "dong-phuc-ao-polo", "polo"],

  "dong-phuc-so-mi": ["dong-phuc-so-mi", "so-mi"],
  "so-mi": ["dong-phuc-so-mi", "so-mi"],

  "dong-phuc-vest-cong-so": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],
  "dong-phuc-vest": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],
  "vest": ["dong-phuc-vest-cong-so", "dong-phuc-vest", "vest"],

  "dong-phuc-teambuilding": ["dong-phuc-teambuilding", "teambuilding"],
  "teambuilding": ["dong-phuc-teambuilding", "teambuilding"],

  "dong-phuc-ao-gio-doanh-nghiep": ["dong-phuc-ao-gio-doanh-nghiep", "dong-phuc-ao-gio", "ao-gio"],

  "bao-ho-lao-dong": ["bao-ho-lao-dong", "bao-ho"],
  "bao-ho": ["bao-ho-lao-dong", "bao-ho"],

  "phu-kien-qua-tang-doanh-nghiep": [
    "phu-kien-qua-tang-doanh-nghiep",
    "qua-tang-phu-kien-doanh-nghiep",
    "phu-kien",
  ],
  "phu-kien": [
    "phu-kien-qua-tang-doanh-nghiep",
    "qua-tang-phu-kien-doanh-nghiep",
    "phu-kien",
  ],
  "dong-phuc-yoga": ["dong-phuc-yoga"],
};

const CORPORATE_CATEGORY_MAP = {
  "dong-phuc-polo": "polo",
  "dong-phuc-ao-polo": "polo",
  "polo": "polo",
  "dong-phuc-so-mi": "so-mi",
  "so-mi": "so-mi",
  "dong-phuc-vest-cong-so": "vest",
  "dong-phuc-vest": "vest",
  "vest": "vest",
  "dong-phuc-teambuilding": "teambuilding",
  "teambuilding": "teambuilding",
  "dong-phuc-ao-gio-doanh-nghiep": "ao-gio",
  "bao-ho-lao-dong": "bao-ho",
  "bao-ho": "bao-ho",
  "phu-kien-qua-tang-doanh-nghiep": "phu-kien",
  "phu-kien": "phu-kien",
};

function filterProductsForSection(products, sectionCategory) {
  const aliases = SECTION_CATEGORY_ALIASES[sectionCategory] || [sectionCategory];
  const mappedProductLine = CORPORATE_CATEGORY_MAP[sectionCategory];

  return products.filter((p) => {
    if (aliases.includes(p.category)) return true;
    if (p.category === "dong-phuc-doanh-nghiep") {
      if (sectionCategory === "dong-phuc-doanh-nghiep") return true;
      if (mappedProductLine && p.productLine === mappedProductLine) return true;
    }
    return false;
  });
}

const FALLBACK_SECTIONS = [
  {
    _id: "gym",
    title: "Đồng Phục Gym",
    category: "dong-phuc-gym",
    viewAllLink: "/dong-phuc-gym",
    productLimit: 12,
  },
  {
    _id: "polo",
    title: "Polo Doanh Nghiệp",
    category: "dong-phuc-polo",
    viewAllLink: "/dong-phuc-polo",
    productLimit: 12,
  },
  {
    _id: "pickleball",
    title: "Đồng Phục Pickleball",
    category: "dong-phuc-pickleball",
    viewAllLink: "/dong-phuc-pickleball",
    productLimit: 12,
  },
  {
    _id: "yoga",
    title: "Đồng Phục Yoga",
    category: "dong-phuc-yoga",
    viewAllLink: "/dong-phuc-yoga",
    productLimit: 12,
  },
  {
    _id: "ao-gio",
    title: "Đồng Phục Áo Gió",
    category: "dong-phuc-ao-gio",
    viewAllLink: "/dong-phuc-ao-gio",
    productLimit: 12,
  },
  {
    _id: "golf",
    title: "Đồng Phục Golf - Tennis",
    category: "dong-phuc-golf-tennis",
    viewAllLink: "/dong-phuc-golf-tennis",
    productLimit: 12,
  },
];

// ─────────────────────────────────────────────────────────────
// GET SERVER SIDE PROPS
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps({ res } = {}) {
  // Set Cache-Control so Cloudflare edge caches HTML for 300s (ISR)
  setPublicCacheHeaders(res);

  try {
    const rawPosts = await readPostsFromDb(3, 0);
    // Strip all unused fields from posts (only serialize UI card fields)
    const homepagePosts = (rawPosts || []).slice(0, 3).map((post) => ({
      title: post.title || "",
      slug: post.slug || "",
      thumbnail: post.thumbnail?.url || post.thumbnail || "",
      createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : "",
      isDirectPost: Boolean(post.isDirectPost),
    }));

    await db.connectDb();
    // Only select fields needed on homepage cards to minimize DB transfer and memory
    const productsData = (await Product.find(
      { visibleOnHome: { $ne: false } },
      "id name slug image colors originalPrice price featuredConfig gallery category productLine isFeatured visibleOnHome"
    ).sort({ displayOrder: 1, createdAt: -1 }).lean()) || [];

    let sectionConfigs = [];
    try {
      sectionConfigs = await HomepageSection.find({ isVisible: true })
        .sort({ order: 1 })
        .lean();
    } catch {
      // ignore — fallback bên dưới xử lý
    }
    if (!sectionConfigs || sectionConfigs.length === 0) {
      sectionConfigs = FALLBACK_SECTIONS;
    }

    const sections = sectionConfigs.map((section) => {
      const categoryProducts = filterProductsForSection(productsData, section.category);
      const featured = categoryProducts.find((p) => p.isFeatured === true) || null;
      return {
        _id: String(section._id),
        title: section.title,
        viewAllLink: normalizeCategoryHref(section.viewAllLink),
        sectionBanner: section.sectionBanner
          ? {
            image: section.sectionBanner.image || "",
            mobileImage: section.sectionBanner.mobileImage || "",
            link: section.sectionBanner.link || "",
            openInNewTab: section.sectionBanner.openInNewTab ?? false,
            isVisible: section.sectionBanner.isVisible ?? false,
            borderRadius: section.sectionBanner.borderRadius ?? 8,
          }
          : null,
        products: categoryProducts
          .slice(0, section.productLimit)
          .map(mapProduct),
        featuredProduct: featured ? mapFeaturedProduct(featured) : null,
      };
    });

    // FAQ trang chủ lấy trực tiếp từ data/homepageFaqs.js để luôn khớp nội dung mới nhất
    const homepageFaqs = DEFAULT_HOMEPAGE_FAQS
      .filter((faq) => faq.isVisible !== false)
      .map((faq, index) => ({
        _id: faq._id ? String(faq._id) : `default-${index}`,
        question: faq.question,
        answer: faq.answer,
        image: faq.image || "/images/thumb-univi.jpg",
        video:
          typeof faq.video === "string" && faq.video.trim() !== ""
            ? faq.video.trim()
            : DEFAULT_CLOUDINARY_VIDEO,
      }));

    // Fetch 15 feedback mới nhất cho SSR — Google thấy nội dung thật
    let initialFeedbacks = [];
    try {
      const rawFeedbacks = await Feedback.find({}, "title slug image").sort({ createdAt: -1 }).limit(15).lean();
      initialFeedbacks = rawFeedbacks.map(p => ({
        title: p.title,
        image: p.image || '/images/dong-phuc-default.jpg',
        link: `/feedback/${p.slug}`,
      }));
    } catch {
      // ignore — FeedbackSection sẽ tự fetch client-side nếu không có SSR data
    }

    // Video feedback cho SSR — chỉ lấy từ DB (không dùng dữ liệu tĩnh).
    // Poster base64 bị lược bỏ để HTML không phình to; client fetch /api/video-feedback sẽ bổ sung.
    let initialVideoFeedbacks = [];
    try {
      const videoSettings = await HomepageVideoFeedbackSettings.findOne({ key: "homepage" }).lean();
      initialVideoFeedbacks = [...(videoSettings?.videos || [])]
        .filter((v) => v && v.isVisible !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((v, index) => ({
          id: v._id ? String(v._id) : `video-${index}`,
          type: v.type === "facebook" ? "facebook" : "local",
          title: v.title || "",
          src: v.src || "",
          fbUrl: v.fbUrl || "",
          poster:
            typeof v.poster === "string" && !v.poster.startsWith("data:") ? v.poster : "",
          isVisible: true,
        }));
    } catch {
      // ignore — VideoFeedback sẽ tự fetch client-side
    }

    return {
      props: {
        posts: homepagePosts,
        sections,
        homepageFaqs,
        initialFeedbacks,
        initialVideoFeedbacks,
        meta: DEFAULT_META,
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error.message, error.stack);
    return {
      props: {
        posts: [],
        sections: [],
        homepageFaqs: DEFAULT_HOMEPAGE_FAQS,
        initialFeedbacks: [],
        meta: DEFAULT_META,
      },
    };
  }
}
