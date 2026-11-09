import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { formatPosts, readPostsFromDb } from '../../lib/utils';
import HeroSection1 from "../../components/univisport/HeroSection1";
import CategoryGrid from '../../components/univisport/CategoryGrid';
import CountdownTimer from '../../components/univisport/CountdownTimer';
import FabricCardComponent from '../../components/univisport/FabricCardComponent';
import SeoArticleSection from '../../components/univisport/SeoArticleSection';
import ProductHubSection from '../../components/univisport/ProductHubSection';
import { setPublicCacheHeaders } from '../../lib/cacheControl';
import db from '../../utils/db';
import Product from '../../models/Product';
import { SIDEBAR_CATEGORIES, getCategoryPath } from '../../lib/siteCategories';
import { ENTERPRISE_FLAT_SLUGS, ENTERPRISE_SLUG } from '../../lib/enterpriseFlatSlugs';
import { getProductLineLabel } from '../../lib/productTaxonomy';
import { PRODUCT_SLUG_FIXES, publicSlug } from '../../lib/slugFixes';
import { hasProductDetailContent } from '../../lib/productContent';

// ─── Nhóm sản phẩm cho khối ProductHubSection (SSR) ─────────────────
// Thể thao: nhóm theo category. Doanh nghiệp: nhóm theo productLine (URL phẳng /dong-phuc-polo...).
// Mỗi nhóm hiện tối đa HUB_PER_GROUP sản phẩm, ưu tiên sản phẩm đã có nội dung (đang index).
const HUB_PER_GROUP = 8;

async function buildProductHubGroups() {
  await db.connectDb();
  const docs = await Product.find({ visibleOnArticle: { $ne: false }, slug: { $exists: true, $ne: '' } })
    .select('name slug image colors category productLine content displayOrder createdAt')
    .lean();

  const toItem = (p) => ({
    name: p.name,
    slug: publicSlug(PRODUCT_SLUG_FIXES, p.slug),
    image: p.colors?.[0]?.image || p.image || '',
    _indexable: hasProductDetailContent(p.content),
    _order: Number.isFinite(p.displayOrder) ? p.displayOrder : 0,
    _created: p.createdAt ? new Date(p.createdAt).getTime() : 0,
  });
  const finish = (key, title, href, items) => {
    const sorted = items.sort((a, b) =>
      (b._indexable - a._indexable) || (a._order - b._order) || (b._created - a._created));
    return {
      key, title, href, total: sorted.length,
      products: sorted.slice(0, HUB_PER_GROUP).map(({ name, slug, image }) => ({ name, slug, image })),
    };
  };

  const sportGroups = SIDEBAR_CATEGORIES.map(([cat, label]) =>
    finish(cat, label, `/${getCategoryPath(cat)}`, docs.filter((p) => p.category === cat).map(toItem)));
  const enterpriseGroups = Object.entries(ENTERPRISE_FLAT_SLUGS).map(([line, flatSlug]) =>
    finish(`dn-${line}`, getProductLineLabel(ENTERPRISE_SLUG, line), `/${flatSlug}`,
      docs.filter((p) => p.category === ENTERPRISE_SLUG && p.productLine === line).map(toItem)));

  return [...sportGroups, ...enterpriseGroups].filter((g) => g.total > 0);
}

// ─── DEFAULT META — dùng cho cả try và catch ─────────────────
const DEFAULT_META = {
  title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
  description:
    "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
  keywords:
    "đồng phục thể thao chuyên dụng, đồng phục Gym, đồng phục Yoga, đồng phục Pilates, đồng phục Pickleball, đồng phục Áo Gió, xưởng may đồng phục Hà Nội, công nghệ UNI DRY, đồng phục doanh nghiệp B2B, may đồng phục theo yêu cầu, Đồng Phục Univi",
  robots: "index, follow",
  author: "Đồng Phục Univi",
  canonical: "https://dongphucunivi.com/san-pham",
  og: {
    title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    description:
      "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    type: "website",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
    imageWidth: "1200",
    imageHeight: "630",
    imageAlt: "Xưởng sản xuất đồng phục thể thao Univi tại phường Chương Mỹ, Hà Nội — công suất 100.000 sản phẩm/tháng",
    url: "https://dongphucunivi.com/san-pham",
    site_name: "Đồng Phục Univi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    description:
      "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
  },
};

// Đặt ngoài component để tránh tạo lại mỗi lần render
const COLLECTION_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
      { "@type": "ListItem", "position": 2, "name": "Sản phẩm", "item": "https://dongphucunivi.com/san-pham" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://dongphucunivi.com/san-pham#webpage",
    "name": "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    "description": "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    "url": "https://dongphucunivi.com/san-pham",
    "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
    "about": { "@id": "https://dongphucunivi.com/#organization" },
  }
];

const ProductsPage = ({ relatedPosts, productGroups = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(''); };
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.message.trim()) newErrors.message = "Vui lòng nhập yêu cầu của bạn";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("Gửi thông tin thành công!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi gửi form"}`);
    }
  };

  return (
    <DefaultLayout2>
      {/* H1 ẩn — chuẩn SEO, có từ khóa địa lý + công nghệ */}
      <h1 className="visually-hidden">
        Đồng Phục Univi — Xưởng May Đồng Phục Thể Thao Chuyên Dụng, Vải UNI DRY Tại Hà Nội
      </h1>

      <div className="relative w-full h-[30vh] md:h-[40vh]">
        <Image
          src="/images/banner-univi.png"
          alt="Xưởng sản xuất đồng phục thể thao Univi tại Hà Nội — Gym, Yoga, Pickleball"
          fill
          className="brightness-50 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="container mx-auto absolute bottom-6 left-0 md:bottom-8 right-0 flex flex-col justify-end items-start text-white pb-3">
          <nav aria-label="Breadcrumb">
            <p className="text-sm uppercase text-gray-300 mb-2">
              <Link href="/" className="hover:underline">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Sản phẩm</span>
            </p>
          </nav>
          <p className="text-2xl md:text-4xl font-bold text-white">Đồng phục Univi</p>
          <p className="text-sm md:text-lg mt-2 max-w-5xl text-gray-200">
            Xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội — Đồng phục Gym, Yoga, Pickleball, Áo Gió chuyên dụng
          </p>
        </div>
      </div>

      <CountdownTimer />
      <CategoryGrid />
      <ProductHubSection groups={productGroups} />
      <HeroSection1 />
      <FabricCardComponent />
      <SeoArticleSection />
    </DefaultLayout2>
  );
};

// ─── SERVER SIDE PROPS ────────────────────────────────────────
export const getServerSideProps = async ({ res } = {}) => {
  setPublicCacheHeaders(res);
  // Hai nguồn dữ liệu độc lập: lỗi một bên không làm mất bên kia.
  const [postsResult, groupsResult] = await Promise.allSettled([
    readPostsFromDb(3, 0).then(formatPosts),
    buildProductHubGroups(),
  ]);
  if (postsResult.status === 'rejected') console.error('Error fetching related posts:', postsResult.reason);
  if (groupsResult.status === 'rejected') console.error('Error building product hub:', groupsResult.reason);

  return {
    props: {
      relatedPosts: postsResult.status === 'fulfilled' ? postsResult.value : [],
      productGroups: groupsResult.status === 'fulfilled' ? groupsResult.value : [],
      meta: { ...DEFAULT_META, schema: COLLECTION_SCHEMA },
    },
  };
};

export default ProductsPage;