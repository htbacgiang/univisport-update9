import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload
} from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from '../../styles/Profile.module.css';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { COMPANY_INFO } from '../../lib/companyInfo';
import { setPublicCacheHeaders } from "../../lib/cacheControl";

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function Profile({ meta }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const [showDownloadOnly, setShowDownloadOnly] = useState(false);
  const containerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage('1');
    setError(null);
    setUseFallback(false);
  };

  const onDocumentLoadError = (err) => {
    console.error('Failed to load PDF with react-pdf:', err);
    setUseFallback(true);
  };

  const handleIframeError = () => {
    setShowDownloadOnly(true);
    setError('Không thể hiển thị PDF trực tiếp. Vui lòng tải về để xem.');
  };

  const goToPage = (newPage) => {
    const page = Math.max(1, Math.min(newPage, numPages || 1));
    setPageNumber(page);
    setInputPage(String(page));
  };

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    } else {
      setInputPage(String(pageNumber));
    }
  };

  useEffect(() => {
    setIsClient(true);

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(Math.min(window.innerWidth - 32, 900));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <DefaultLayout>
      <section className="w-full pb-8 sm:pb-10">
        <div className={`container mx-auto px-4 ${styles.container}`}>
          <div className="mt-[60px] sm:mt-[91px]"></div>
          <main className={styles.main}>
            <h1 className="sr-only">Hồ sơ năng lực Đồng phục Univi</h1>
            <div ref={containerRef} className="w-full max-w-6xl mx-auto overflow-x-hidden">
              {/* Navigation & Controls Toolbar */}
              {numPages && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-3 mb-4 shadow-sm sticky  z-20">
                  {/* Left: Prev / Page Input / Next */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => goToPage(pageNumber - 1)}
                      disabled={pageNumber <= 1}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm font-medium"
                      title="Trang trước"
                    >
                      <FaChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Trước</span>
                    </button>

                    <form onSubmit={handlePageSubmit} className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">Trang</span>
                      <input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={inputPage}
                        onChange={handlePageInputChange}
                        onBlur={handlePageSubmit}
                        className="w-14 text-center py-1 px-1.5 border border-gray-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-[#105d97] focus:outline-none"
                      />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        / {numPages}
                      </span>
                    </form>

                    <button
                      type="button"
                      onClick={() => goToPage(pageNumber + 1)}
                      disabled={pageNumber >= numPages}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm font-medium"
                      title="Trang sau"
                    >
                      <span className="hidden sm:inline">Sau</span>
                      <FaChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Right: Zoom & Download */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setScale(s => Math.max(s - 0.1, 0.6))}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                      title="Thu nhỏ"
                    >
                      <FaSearchMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold text-gray-600 w-12 text-center select-none">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setScale(s => Math.min(s + 0.1, 2.0))}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                      title="Phóng to"
                    >
                      <FaSearchPlus className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href="/ho-so-nang-luc.pdf"
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#105d97] hover:bg-[#0c4d7d] text-white text-xs sm:text-sm font-medium rounded-lg transition shadow-sm ml-2"
                    >
                      <FaDownload className="w-3.5 h-3.5" />
                      <span>Tải PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Main PDF Viewer */}
              <div className={styles.pdfContainer}>
                {error && <p className={styles.error}>{error}</p>}
                {!useFallback ? (
                  <Document
                    file="/ho-so-nang-luc.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="py-20 text-gray-500 flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#105d97]"></div>
                        <span className="text-sm font-medium">Đang tải hồ sơ năng lực...</span>
                      </div>
                    }
                  >
                    {numPages && (
                      <Page
                        key={`page_${pageNumber}`}
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className={styles.pdfPage}
                        scale={scale}
                        width={containerWidth ? Math.min(containerWidth - 16, 950) : 800}
                      />
                    )}
                  </Document>
                ) : (
                  <div className={styles.fallbackContainer}>
                    {showDownloadOnly ? (
                      <div className={styles.downloadOnlyContainer}>
                        <div className={styles.downloadIcon}>📄</div>
                        <h3 className={styles.downloadTitle}>Hồ sơ năng lực Đồng phục Univi</h3>
                        <p className={styles.downloadDescription}>
                          Để xem hồ sơ năng lực, vui lòng tải file PDF về thiết bị của bạn.
                        </p>
                        <a
                          href="/ho-so-nang-luc.pdf"
                          download
                          className={styles.downloadButton}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📥 Tải hồ sơ năng lực (PDF)
                        </a>
                      </div>
                    ) : (
                      <>
                        <iframe
                          src={`/ho-so-nang-luc.pdf#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                          width="100%"
                          height="100%"
                          title="Hồ sơ năng lực Đồng phục Univi"
                          className={styles.pdfIframe}
                          style={{ border: 'none', overflow: 'hidden' }}
                          onError={handleIframeError}
                        />

                        <div className={styles.downloadSection}>
                          <a
                            href="/ho-so-nang-luc.pdf"
                            download
                            className={styles.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 Tải hồ sơ năng lực (PDF)
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getServerSideProps({ res } = {}) {
  setPublicCacheHeaders(res);
  const years = new Date().getFullYear() - Number(COMPANY_INFO.foundingYear);

  const meta = {
    title: "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
    description:
      "Đồng phục Univi – Xưởng may 2.000m² tại Chương Mỹ (Hà Nội), công suất 100.000 sản phẩm/tháng. Chuyên sản xuất đồng phục thể thao và doanh nghiệp với công nghệ Uni Dry.",
    content:
      "Đồng phục Univi – Xưởng may 2.000m² tại Chương Mỹ (Hà Nội), công suất 100.000 sản phẩm/tháng. Chuyên sản xuất đồng phục thể thao và doanh nghiệp với công nghệ Uni Dry.",
    keywords:
      "hồ sơ năng lực Đồng phục Univi, quần áo thể thao, công nghệ Uni Dry, vải thể thao, trang phục gym, quần áo yoga, chạy bộ, vải an toàn cho da, xưởng may đồng phục Hà Nội",
    robots: "index, follow",
    author: "Đồng phục Univi",
    canonical: "https://dongphucunivi.com/ho-so-nang-luc",

    og: {
      title: "Hồ sơ năng lực Đồng phục Univi – Quần áo thể thao chuyên dụng",
      description:
        "Khám phá hồ sơ năng lực Đồng phục Univi: Xưởng may 2.000m² tại Chương Mỹ, công suất 100.000 sản phẩm/tháng, công nghệ Uni Dry, an toàn cho da.",
      type: "website",
      image: "https://dongphucunivi.com/images/banner-1.webp",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/ho-so-nang-luc",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
      description:
        "Đồng phục Univi – Xưởng may 2.000m² tại Chương Mỹ (Hà Nội), công suất 100.000 sp/tháng, công nghệ Uni Dry chuyên dụng cho thể thao và doanh nghiệp.",
      image: "https://dongphucunivi.com/images/banner-1.webp",
    },
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
          { "@type": "ListItem", "position": 2, "name": "Hồ sơ năng lực", "item": "https://dongphucunivi.com/ho-so-nang-luc" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "DigitalDocument",
        "@id": "https://dongphucunivi.com/ho-so-nang-luc#profile-pdf",
        "name": "Hồ sơ năng lực Đồng phục Univi 2026 (Bản PDF)",
        "encodingFormat": "application/pdf",
        "url": "https://dongphucunivi.com/ho-so-nang-luc.pdf",
        "description": "Tài liệu hồ sơ năng lực chính thức của Đồng phục Univi năm 2026: Năng lực xưởng may, quy trình 6 bước, 8 bộ phận sản xuất, hệ sinh thái và khách hàng tiêu biểu.",
        "author": {
          "@type": "Organization",
          "name": COMPANY_INFO.name,
          "legalName": COMPANY_INFO.legalName,
          "url": COMPANY_INFO.website,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": "https://dongphucunivi.com/ho-so-nang-luc#webpage",
        "name": "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
        "description": `Đồng phục Univi thuộc ${COMPANY_INFO.legalName}, kinh nghiệm hơn ${years} năm trong lĩnh vực sản xuất đồng phục thể thao và doanh nghiệp. Xưởng sản xuất khoảng ${COMPANY_INFO.factory.area} tại ${COMPANY_INFO.factory.addressLocality}, ${COMPANY_INFO.factory.addressRegion} với khoảng 100 thợ may lành nghề, công suất ${COMPANY_INFO.factory.capacity}.`,
        "url": "https://dongphucunivi.com/ho-so-nang-luc",
        "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
        "about": {
          "@type": "Organization",
          "name": COMPANY_INFO.name,
          "legalName": COMPANY_INFO.legalName,
          "taxID": COMPANY_INFO.taxCode,
          "telephone": COMPANY_INFO.hotline,
          "email": COMPANY_INFO.email,
          "url": COMPANY_INFO.website,
          "foundingDate": COMPANY_INFO.foundingYear,
          "slogan": COMPANY_INFO.slogan,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": COMPANY_INFO.office.streetAddress,
            "addressLocality": COMPANY_INFO.office.addressLocality,
            "addressRegion": COMPANY_INFO.office.addressRegion,
            "addressCountry": "VN",
          },
          "knowsAbout": [
            "Đồng phục thể thao (Gym, PT, Yoga, Pilates, Pickleball, Tennis, Cầu lông, Bóng đá, Chạy bộ, MMA, Boxing, Bơi)",
            "Đồng phục doanh nghiệp (Áo Polo, Áo thun, Sơ mi, Vest, Đồng phục công sở, Teambuilding, Sự kiện)",
            "Công nghệ vải Uni Dry, Uni Super Cool, Uni Quick Dry thoát ẩm một chiều",
            "Công nghệ in thêu PET, decal, chuyển nhiệt, in nổi silicone/TPU",
            `Xưởng may ${COMPANY_INFO.factory.area} tại ${COMPANY_INFO.factory.addressLocality} với khoảng 100 thợ may lành nghề`,
            `Năng lực sản xuất trên 4.000 sản phẩm/ngày, công suất ${COMPANY_INFO.factory.capacity}`,
            "8 bộ phận sản xuất: Điều phối, Kho, Cắt, Mẫu & Kỹ thuật, May, In/Ép, QC, Hoàn thiện",
            "Quy trình sản xuất 6 bước: Market → Nguyên phụ liệu → Cắt → May → In/Thêu → Đóng gói & Giao hàng",
          ],
          "memberOf": [
            { "@type": "Brand", "name": "UNIVI SPORT", "description": "Đồng phục và trang phục thể thao" },
            { "@type": "Brand", "name": "UNIVI UNIFORM", "description": "Đồng phục doanh nghiệp, tổ chức" },
            { "@type": "Brand", "name": "UNIVI OFFICE", "description": "Thời trang công sở" },
            { "@type": "Brand", "name": "UNIVI ELEGANT", "description": "Dòng sản phẩm thanh lịch" },
            { "@type": "Brand", "name": "UNIVI KIDS", "description": "Trang phục trẻ em" },
            { "@type": "Brand", "name": "UNIVI UNDERWEAR", "description": "Đồ lót, đồ mặc nhà" },
          ],
          "customer": [
            { "@type": "Organization", "name": "Sun Group" },
            { "@type": "Organization", "name": "Vingroup" },
            { "@type": "Organization", "name": "Hyundai Thành Công" },
            { "@type": "Organization", "name": "Tập đoàn Than – Khoáng sản Việt Nam (TKV)" },
            { "@type": "Organization", "name": "Herbalife" },
            { "@type": "Organization", "name": "The One Kickfit" },
            { "@type": "Organization", "name": "Lif Up" },
          ],
        },
      },
    ],
  };

  return {
    props: {
      meta,
    },
  };
}