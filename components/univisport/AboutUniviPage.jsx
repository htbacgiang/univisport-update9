import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle, Target, Scale, Lightbulb, Zap, Network, Shirt, Building2, Users,
  ChevronLeft, ChevronRight, Maximize2, X, Images
} from 'lucide-react';
import UniviOrderProcess from './order-process/UniviOrderProcess';

const SectionHeader = ({ roman, title, highlight }) => (
  <div className="text-center mb-8">
    <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 uppercase">
      {roman}{title && <> {title}</>}{highlight && <> <span className="text-[#105d97]">{highlight}</span></>}
    </h2>
    <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-[#105d97]" />
  </div>
);

const StepCard = ({ number, title, children, accent }) => (
  <div className={`rounded-xl p-6 ${accent ? 'bg-blue-50 border-l-4 border-[#105d97]' : 'bg-gray-50'}`}>
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-base md:text-lg text-gray-900 mb-2">{title}</h4>
        {children}
      </div>
    </div>
  </div>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2 text-gray-700">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#105d97] flex-shrink-0" />
    {children}
  </li>
);

const PRODUCTION_GALLERY_IMAGES = [
  {
    src: '/images/xuong/anh-xuong-2.jpg',
    alt: 'Khu vực xưởng sản xuất đồng phục của Univi',
    title: 'Khu vực sản xuất chính',
    caption: 'Hệ thống chuyền may hiện đại đáp ứng các đơn hàng đồng phục thể thao & doanh nghiệp số lượng lớn.',
  },
  {
    src: '/images/xuong/anh-xuong-1.jpg',
    alt: 'Dây chuyền máy may công nghiệp chuyên dụng Univi',
    title: 'Dây chuyền may công nghiệp',
    caption: 'Trang thiết bị may chuyên dụng tối ưu cho các dòng vải thun thể thao co giãn và áo polo cao cấp.',
  },
  {
    src: '/images/xuong/anh-xuong-3.jpg',
    alt: 'Quy mô nhà xưởng và kho lưu trữ nguyên phụ liệu Univi',
    title: 'Quy mô nhà xưởng & kho vật liệu',
    caption: 'Không gian sản xuất đạt chuẩn cùng kho vải và nguyên phụ liệu phong phú sẵn sàng vận hành liên tục.',
  },
  {
    src: '/images/xuong/anh-xuong-4.jpg',
    alt: 'Khu vực thiết kế, ra rập và hoàn thiện mẫu đồng phục',
    title: 'Phòng thiết kế & phát triển mẫu',
    caption: 'Đội ngũ kỹ thuật rập và thiết kế mẫu chuyên nghiệp, hiện thực hóa mọi ý tưởng sản phẩm theo yêu cầu.',
  },
  {
    src: '/images/xuong/anh-xuong-5.jpg',
    alt: 'Quy trình kiểm soát chất lượng KCS và hoàn thiện xuất xưởng',
    title: 'Kiểm soát chất lượng (KCS) & Hoàn thiện',
    caption: 'Mỗi sản phẩm đều được kiểm tra kỹ lưỡng về form dáng, đường may và thông số trước khi xuất xưởng.',
  },
];

function ProductionGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const total = PRODUCTION_GALLERY_IMAGES.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchEndX.current - touchStartX.current;
    if (diff > 50) handlePrev();
    else if (diff < -50) handleNext();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = PRODUCTION_GALLERY_IMAGES[currentIndex];

  return (
    <figure className="max-w-2xl mx-auto mb-8">
      {/* Khung ảnh vuông chính (tỷ lệ vuông 1:1) */}
      <div
        className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-900 shadow-md group select-none cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={current.src}
          alt={current.alt}
          layout="fill"
          objectFit="cover"
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Lớp phủ gradient cho chú thích */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* Tag chỉ số & Nút mở rộng */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="p-2 rounded-full bg-black/60 hover:bg-[#105d97] text-white transition-colors backdrop-blur-md shadow"
            title="Xem toàn màn hình"
            aria-label="Xem toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Nút lướt ảnh trái / phải */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 hover:bg-[#105d97] text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100 shadow-md hover:scale-110 active:scale-95 z-10"
          aria-label="Hình ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 hover:bg-[#105d97] text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 md:opacity-0 md:group-hover:opacity-100 shadow-md hover:scale-110 active:scale-95 z-10"
          aria-label="Hình ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Dãy 5 ảnh thu nhỏ vuông vức (aspect-square) */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-3">
        {PRODUCTION_GALLERY_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`group relative aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-200 ${isActive
                ? 'border-[#105d97] ring-2 ring-[#105d97]/40 shadow-md scale-[1.02]'
                : 'border-transparent opacity-65 hover:opacity-100 hover:scale-[1.01]'
                }`}
              title={img.title}
              aria-label={`Xem ảnh ${idx + 1}: ${img.title}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 768px) 20vw, 130px"
              />
              <div
                className={`absolute inset-0 transition-opacity ${isActive ? 'bg-[#105d97]/15' : 'bg-black/20 group-hover:bg-transparent'
                  }`}
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white backdrop-blur-xs">
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      <figcaption className="text-center text-xs md:text-sm text-gray-500 pt-3 italic">
        Hình ảnh khu vực sản xuất của Đồng Phục Univi
      </figcaption>

      {/* Lightbox xem ảnh toàn màn hình */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col justify-between p-4 md:p-6 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Lightbox */}
          <div className="flex items-center justify-between text-white z-20">
            <span className="text-sm md:text-base font-medium flex items-center gap-2">
              <Images className="w-5 h-5 text-blue-400" />
              {current.title} ({currentIndex + 1} / {total})
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Vùng ảnh to */}
          <div
            className="relative flex-1 w-full max-w-2xl mx-auto my-3 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square max-h-[75vh]">
              <Image
                src={current.src}
                alt={current.alt}
                layout="fill"
                objectFit="contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Nút lướt trong lightbox */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-[#105d97] text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-[#105d97] text-white flex items-center justify-center transition-colors shadow-lg"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer Lightbox & Thumbnails vuông */}
          <div className="max-w-3xl mx-auto w-full z-20" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-xs md:text-sm text-gray-300 mb-3 px-4">
              {current.caption}
            </p>
            <div className="flex justify-center gap-2 md:gap-3 overflow-x-auto py-1">
              {PRODUCTION_GALLERY_IMAGES.map((img, idx) => (
                <button
                  key={`modal-${img.src}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-12 md:w-16 md:h-16 aspect-square rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${idx === currentIndex
                    ? 'border-[#105d97] ring-2 ring-[#105d97]/40 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  aria-label={`Ảnh ${idx + 1}`}
                >
                  <Image src={img.src} alt={img.alt} layout="fill" objectFit="cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}

// ─── Image Gallery Section (Theo chuẩn ProductDetailView.jsx) ──────────────────
const getPhotoRatio = (photo) => {
  const width = Number(photo?.width);
  const height = Number(photo?.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return 4 / 3;
  }
  return width / height;
};

const buildGalleryRows = (photos, targetRatio = 5.2, maxPerRow = 4) => {
  const rows = [];
  let currentRow = [];
  let currentRatio = 0;

  photos.forEach((photo) => {
    currentRow.push(photo);
    currentRatio += getPhotoRatio(photo);

    if (currentRatio >= targetRatio || currentRow.length >= maxPerRow) {
      rows.push(currentRow);
      currentRow = [];
      currentRatio = 0;
    }
  });

  if (currentRow.length > 0) {
    const previousRow = rows[rows.length - 1];
    while (
      currentRow.length < 2 &&
      previousRow &&
      previousRow.length > 2 &&
      previousRow.length <= maxPerRow
    ) {
      currentRow.unshift(previousRow.pop());
    }
    rows.push(currentRow);
  }

  return rows;
};

const SPORTS_GALLERY_PHOTOS = [
  {
    src: 'https://live.staticflickr.com/65535/55342992386_38da3bb78b_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục thể thao Univi Sport',
  },
  {
    src: 'https://live.staticflickr.com/65535/55343143199_64d57f3ebe_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục áo khoác gió',
  },
  {
    src: 'https://live.staticflickr.com/65535/55634403904_73904b2e7d_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục pt gym Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55633209432_278c286a43_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục huấn luyện viên thể thao chuyên nghiệp',
  },
  {
    src: 'https://live.staticflickr.com/65535/55566192339_9ed7c23aa8_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục Yoga & Pilates nữ chuyên biệt',
  },
  {
    src: '/images/chay-bo.jpg',
    width: 533,
    height: 533,
    alt: 'Đồng phục giải chạy bộ & điền kinh Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55568023498_3485226446_b.jpg',
    width: 800,
    height: 533,
    alt: 'Đồng phục giải chạy bộ & điền kinh Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55572538516_488722629b_b.jpg',
    width: 533,
    height: 533,
    alt: 'Đồng phục huấn luyện viên Pilates',
  },
];

const ENTERPRISE_GALLERY_PHOTOS = [
  {
    src: 'https://live.staticflickr.com/65535/55475604538_5346df2b81_b.jpg',
    width: 800,
    height: 533,
    alt: 'Đồng phục doanh nghiệp chuyên nghiệp Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55474487702_05668aaa00_b.jpg',
    width: 633,
    height: 800,
    alt: 'Áo polo, thun sự kiện và sơ mi công sở Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55482399466_ff4e293f8e_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục văn phòng & công sở cao cấp',
  },
  {
    src: 'https://live.staticflickr.com/65535/55483093612_38b25b365f_b.jpg',
    width: 533,
    height: 800,
    alt: 'Áo polo đồng phục doanh nghiệp phong cách hiện đại',
  },
  {
    src: 'https://live.staticflickr.com/65535/55480255298_94092545d1_b.jpg',
    width: 533,
    height: 800,
    alt: 'Bộ mockup thiết kế áo polo doanh nghiệp Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55488815769_6b3d0f68c9_b.jpg',
    width: 533,
    height: 800,
    alt: 'Bộ mockup thiết kế áo polo doanh nghiệp Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55475701521_16be272795_b.jpg',
    width: 533,
    height: 800,
    alt: 'Bộ mockup thiết kế áo polo doanh nghiệp Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55487547543_4f48026232_b.jpg',
    width: 533,
    height: 800,
    alt: 'Bộ mockup thiết kế áo polo doanh nghiệp Univi',
  },


];

const OTHER_GALLERY_PHOTOS = [
  {
    src: 'https://live.staticflickr.com/65535/55482648906_92d13f29a0_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục sự kiện, team building & học đường Univi',
  },
  {
    src: 'https://live.staticflickr.com/65535/55490616689_d11078b529_b.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục sự kiện, team building & học đường Univi',
  },
  {
    src: '/teambuilding/dong-phuc-teambuilding-doanh-nghiep-tap-the.jpg',
    width: 800,
    height: 533,
    alt: 'Đồng phục sự kiện, team building & học đường Univi',
  },
  {
    src: '/teambuilding/dong-phuc-teambuilding-co-tron.jpg',
    width: 533,
    height: 800,
    alt: 'Đồng phục sự kiện, team building & học đường Univi',
  },

];

function GalleryLightbox({ photos, currentIndex, onClose, onNext, onPrev }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh trước"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2.5 md:p-3 z-10 transition-colors"
        aria-label="Ảnh sau"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div
        className="relative inline-flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-2 md:-top-7 md:-right-10 bg-gray-600 hover:bg-red-700 text-white rounded-full p-2 md:p-2.5 z-10 transition-colors shadow-lg"
          aria-label="Đóng"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="relative w-[85vw] h-[85vh] md:w-[90vw] md:h-[90vh]">
          <Image
            src={typeof photo === 'string' ? photo : photo.src}
            alt={`Ảnh ${currentIndex + 1}`}
            fill
            className="object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

function CategoryGallerySection({ title, photos }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryRows = useMemo(() => buildGalleryRows(photos, 5.2, 4), [photos]);

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);
  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-6 bg-white mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 bg-[#105d97] rounded-full" />
        <h4 className="text-base md:text-lg font-medium tracking-tight text-gray-900">
          {title}
        </h4>
        <span className="ml-auto text-xs text-gray-400">{photos.length} ảnh</span>
      </div>

      <div className="gallery-container">
        <style jsx>{`
          .gallery-container {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .gallery-row {
            display: grid;
            grid-template-columns: var(--gallery-columns);
            gap: 0.25rem;
            align-items: start;
          }

          @media (min-width: 640px) {
            .gallery-container {
              gap: 0.5rem;
            }

            .gallery-row {
              gap: 0.5rem;
            }
          }
        `}</style>

        {galleryRows.map((row, rowIndex) => {
          let globalIndex = galleryRows
            .slice(0, rowIndex)
            .reduce((total, currentRow) => total + currentRow.length, 0);

          return (
            <div
              key={`row-${rowIndex}`}
              className="gallery-row"
              style={{
                '--gallery-columns': row
                  .map((photo) => `${getPhotoRatio(photo)}fr`)
                  .join(' '),
              }}
            >
              {row.map((photo) => {
                const photoIndex = globalIndex;
                globalIndex += 1;

                return (
                  <button
                    key={`${photo.src}-${photoIndex}`}
                    type="button"
                    className="gallery-item group block w-full overflow-hidden rounded-lg bg-gray-100 text-left shadow-sm transition-shadow hover:shadow-md"
                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                    onClick={() => openLightbox(photoIndex)}
                    aria-label={`Xem ảnh ${photoIndex + 1} trong thư viện`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={photos.map((p) => p.src)}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}

export default function AboutUniviPage() {
  return (
    <article className="max-w-none">

      {/* II. Định hướng & Mục tiêu */}
      <section className="py-6 md:py-12 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="II." title="Định hướng" highlight="phát triển và mục tiêu" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { title: 'ĐỊNH HƯỚNG PHÁT TRIỂN', body: 'Univi tập trung nghiên cứu và phát triển sản phẩm Đồng Phục Thể Thao, chú trọng vào chất liệu và mẫu mã phù hợp cho từng bộ môn thể thao.' },
            { title: 'MỤC TIÊU DÀI HẠN', body: 'Trở thành công ty niêm yết trên sàn chứng khoán, đồng thời triển khai phát triển hệ sinh thái Univi.' },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-7 rounded-full bg-[#105d97]" />
                <h3 className="font-medium text-gray-900">{card.title}</h3>
              </div>
              <p className="text-gray-700 leading-6">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Giá trị cốt lõi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-medium text-lg md:text-xl text-gray-900 text-center mb-6">GIÁ TRỊ CỐT LÕI</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: 'CHÂN THÀNH', desc: 'Nghĩ thẳng - nói thật', icon: CheckCircle },
              { title: 'TRÁCH NHIỆM', desc: 'Nghĩ tới - Làm tới', icon: Target },
              { title: 'KỶ LUẬT', desc: 'Nghĩ chuẩn - Làm đúng', icon: Scale },
              { title: 'SÁNG TẠO', desc: 'Nghĩ khác - Làm mới', icon: Lightbulb },
              { title: 'QUYẾT LIỆT', desc: 'Nghĩ nhanh - Làm nhanh', icon: Zap },
            ].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="text-center bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#105d97] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-gray-900 text-xs mb-1">{title}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hệ sinh thái */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-lg md:text-xl text-gray-900 text-center mb-6">HỆ SINH THÁI UNIVI</h3>
          <p className="text-center text-gray-500 text-sm mb-6">Đa dạng thương hiệu phục vụ mọi nhu cầu</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'SPORT', desc: 'Thể thao chuyên nghiệp' },
              { name: 'ELEGANT', desc: 'Thời trang cao cấp' },
              { name: 'OFFICE', desc: 'Công sở lịch sự' },
              { name: 'KIDS', desc: 'Trẻ em năng động' },
              { name: 'UNDERWEAR', desc: 'Đồ lót tiện nghi' },
              { name: 'UNIFORM', desc: 'Đồng phục doanh nghiệp' },
            ].map(({ name, desc }) => (
              <div key={name} className="text-center bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#105d97]/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-[#105d97]" />
                </div>
                <p className="font-medium text-gray-900 text-xs mb-1">{name}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content paragraph */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <div className="bg-white rounded-2xl md:p-8 p-4 shadow-sm border border-gray-100 space-y-5">
          <p className="text-gray-700 leading-6 text-base">
            Trong giai đoạn <span className="font-semibold text-[#105d97]">2023 - 2028</span>, Univi tập trung nghiên cứu và phát triển sản phẩm Đồng Phục Thể Thao, chú trọng vào chất liệu và mẫu mã phù hợp cho từng bộ môn thể thao. Đồng thời, tối ưu hóa dịch vụ tư vấn và trải nghiệm khách hàng, cùng với quản lý thông tin và mối quan hệ khách hàng.
          </p>
          <p className="text-gray-700 leading-6 text-base">
            Với mục tiêu phát triển thương hiệu qua truyền thông, marketing và mở rộng cửa hàng trưng bày, Univi tăng cường độ phủ trên toàn quốc, đặc biệt là ở các khu kinh tế trọng điểm. Nâng cao năng lực sản xuất bằng việc mở rộng quy mô và đầu tư vào công nghệ cao, giúp tăng năng suất và chất lượng sản phẩm.
          </p>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <p className="text-gray-700 leading-6 font-medium">
              Mục tiêu lớn của Univi là duy trì quan hệ tốt với <span className="font-semibold text-[#105d97]">hàng trăm nghìn khách hàng</span> và đối tác trên cả nước. Chiến lược 2025-2028 tập trung phát triển mảng Đồng Phục Thể Thao và xây dựng thương hiệu mạnh mẽ trong ngành sản xuất thời trang tại Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* III. Tầm nhìn chiến lược */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="III." title="Tầm nhìn chiến lược" />

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { n: '01', title: 'Định hướng sáng tạo', sub: 'trong lĩnh vực Đồng Phục', icon: Lightbulb },
            { n: '02', title: 'Chuyên sâu Đồng Phục Thể Thao', sub: 'tại Việt Nam', icon: Target },
            { n: '03', title: 'Kiến tạo thương hiệu', sub: 'qua Đồng Phục', icon: Network },
            { n: '04', title: 'Đồng Phục Toàn Diện', sub: 'cho doanh nghiệp', icon: CheckCircle },
            { n: '05', title: 'Ngôn ngữ thương hiệu', sub: 'mạnh mẽ nhất', icon: Zap },
          ].map(({ n, title, sub, icon: Icon }) => (
            <div key={n} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">
                {n}
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{title}</h4>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-6 text-base">
            Univi định hướng phát triển theo hướng <strong className="text-[#105d97]">sáng tạo</strong> trong lĩnh vực Đồng Phục tại Việt Nam, đặc biệt là mảng <strong className="text-[#105d97]">Đồng Phục Thể Thao chuyên sâu</strong>. Chúng tôi kiến tạo hình ảnh thương hiệu thông qua sự kết hợp tinh tế giữa:
          </p>
          <ul className="bg-gray-50 rounded-xl p-5 space-y-2">
            <Bullet><strong>Công nghệ sản xuất hiện đại</strong></Bullet>
            <Bullet><strong>Thiết kế đột phá mang dấu ấn riêng</strong></Bullet>
            <Bullet><strong>Giải pháp cá nhân hóa linh hoạt cho từng đội nhóm</strong></Bullet>
          </ul>
          <p className="text-gray-700 leading-6 text-base">
            Với tầm nhìn dài hạn, Univi không đơn thuần là một đơn vị sản xuất đồng phục, mà là <strong className="text-[#105d97]">người bạn đồng hành chiến lược</strong> – mang đến giải pháp <strong className="text-[#105d97]">đồng phục toàn diện</strong> cho các doanh nghiệp, tổ chức và cộng đồng yêu thể thao.
          </p>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <p className="text-gray-700 leading-6 italic">
              Chúng tôi tin rằng: <strong className="text-[#105d97]">khi đồng phục thể hiện được bản sắc – nó trở thành ngôn ngữ mạnh mẽ nhất để truyền tải giá trị của tập thể, đội nhóm.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* IV. Năng lực sản xuất */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="IV." title="Năng lực sản xuất" />

        <ProductionGallery />

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-700 leading-6">
              Xưởng may Univi là nơi kết tinh giữa <strong className="text-[#105d97]">công nghệ hiện đại</strong>, <strong className="text-[#105d97]">tay nghề tinh hoa</strong> cùng sự nghiên cứu chuyên sâu về chất liệu, tạo nên sự khác biệt cho sản phẩm đồng phục của Univi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Dây chuyền sản xuất tiên tiến', body: 'Với dây chuyền sản xuất tiên tiến được tối ưu hóa từng khâu, Univi không chỉ đảm bảo hiệu suất sản xuất vượt trội mà còn duy trì sự đồng nhất và hoàn hảo trong từng chi tiết sản phẩm.' },
              { title: 'Đội ngũ thợ lành nghề', body: 'Đội ngũ thợ lành nghề của chúng tôi không chỉ làm việc bằng kinh nghiệm mà còn bằng đam mê sáng tạo, luôn ưu tiên chất lượng và sự hài lòng của khách hàng.' },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">{c.title}</h4>
                <p className="text-gray-700 leading-6">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <h4 className="font-medium text-gray-900 mb-2">Quy trình sản xuất khép kín</h4>
            <p className="text-gray-700 leading-6">
              Quy trình sản xuất khép kín của Univi không chỉ giúp đối tác tiết kiệm được các chi phí trung gian mà còn giảm thiểu rủi ro, đảm bảo mỗi sản phẩm khi rời khỏi xưởng đều là một thiết kế chuyên biệt chuẩn mực, khác biệt hoàn toàn với nhiều sản phẩm thị trường.
            </p>
          </div>
        </div>
      </section>

      {/* V. Quy trình lên mẫu */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="V." title="Quy trình lên mẫu đồng phục" />
        <UniviOrderProcess />
      </section>

      {/* VI. Lĩnh vực hoạt động */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VI." title="Lĩnh vực hoạt động của Univi" />
        <div className="space-y-4 mb-6">
          <p className="text-gray-700 leading-6 text-base">
            <strong className="text-[#105d97]">Đồng Phục Univi</strong> cung cấp giải pháp thiết kế, tư vấn và sản xuất đồng phục theo yêu cầu cho doanh nghiệp, tổ chức, phòng tập thể thao và các cộng đồng đội nhóm tại Việt Nam. Với định hướng phát triển chuyên sâu về chất liệu, kiểu dáng và công năng sử dụng, Univi không chỉ tạo ra những bộ đồng phục đồng nhất về hình ảnh mà còn chú trọng trải nghiệm, sự thoải mái và hiệu quả sử dụng trong từng môi trường hoạt động.
          </p>
          <p className="text-gray-700 leading-6 text-base">
            Hiện nay, Univi tập trung phát triển ba nhóm lĩnh vực chính: <strong className="text-[#105d97]">Đồng phục thể thao, Đồng phục doanh nghiệp và Các dòng đồng phục chuyên biệt khác.</strong>
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              n: '1', title: 'ĐỒNG PHỤC THỂ THAO', icon: Shirt,
              items: ['Đồng phục Gym & Fitness', 'Đồng phục Yoga & Pilates', 'Đồng phục Pickleball & Tennis', 'Đồng phục chạy bộ (Running)', 'Đồng phục cầu lông, bóng đá, thể thao đồng đội', 'Đồng phục MMA & Boxing', 'Đồng phục Golf & thể thao ngoài trời', 'Đồng phục huấn luyện viên'],
            },
            {
              n: '2', title: 'ĐỒNG PHỤC DOANH NGHIỆP', icon: Building2,
              items: ['Đồng phục áo polo doanh nghiệp', 'Đồng phục áo thun doanh nghiệp', 'Đồng phục sơ mi công sở', 'Đồng phục vest công sở', 'Đồng phục teambuilding', 'Đồng phục sự kiện và quảng bá', 'Đồng phục nhân viên theo ngành nghề'],
            },
            {
              n: '3', title: 'ĐỒNG PHỤC CHUYÊN BIỆT KHÁC', icon: Users,
              items: ['Đồng phục học sinh', 'Đồng phục gia đình', 'Đồng phục du lịch', 'Đồng phục họp lớp', 'Đồng phục cộng đồng', 'Đồng phục bảo hộ lao động'],
            },
          ].map(({ n, title, icon: Icon, items }) => (
            <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 bg-[#105d97]/5 border-b border-gray-100 px-5 py-4">
                <div className="w-7 h-7 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">{n}</div>
                <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
              </div>
              <div className="p-5">
                <ul className="space-y-2 text-sm text-gray-700">
                  {items.map((item) => <Bullet key={item}>{item}</Bullet>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-sections: 1. Thể thao, 2. Doanh nghiệp, 3. Chuyên biệt khác */}
      {[
        {
          n: '1',
          title: '1. Đồng phục thể thao - Lĩnh vực phát triển trọng tâm',
          intro: [
            <>Đồng Phục Univi tiên phong cung cấp giải pháp <strong className="text-[#105d97]">đồng phục thể thao chuyên nghiệp</strong> cho các chuỗi phòng tập và các đội nhóm tập Gym, Fitness, Pickleball, Yoga, Running, Pilates, MMA... tại Việt Nam.
              Đây là lĩnh vực được Univi ưu tiên đầu tư nghiên cứu và phát triển, với định hướng tạo ra những sản phẩm không chỉ đẹp về thiết kế mà còn đáp ứng yêu cầu vận động đặc thù của từng bộ môn thể thao.</>,
            <>Univi chú trọng lựa chọn chất liệu có độ co giãn, khả năng thoát ẩm, nhanh khô và độ bền phù hợp với cường độ sử dụng. Kiểu dáng, màu sắc và kỹ thuật hoàn thiện cũng được tư vấn dựa trên đặc điểm vận động, hình ảnh thương hiệu và nhu cầu thực tế của từng khách hàng.</>,
          ],
          productsTitle: 'Các dòng đồng phục thể thao Univi cung cấp:',
          products: [
            ['Đồng phục Gym & Fitness', 'Áo tập, quần tập, áo ba lỗ, áo croptop và trang phục dành cho hội viên phòng tập, huấn luyện viên cá nhân (PT), huấn luyện viên thể hình và đội ngũ nhân sự Fitness Center.'],
            ['Đồng phục Yoga & Pilates', 'Trang phục tập Yoga, Pilates dành cho nam và nữ; áo tập, quần legging, áo bra và các thiết kế chuyên biệt đáp ứng yêu cầu co giãn, ôm vừa cơ thể, che phủ phù hợp và không gây vướng víu khi thực hiện động tác.'],
            ['Đồng phục Pickleball & Tennis', 'Áo polo, áo thi đấu, chân váy, quần thể thao và trang phục đội nhóm dành cho câu lạc bộ, học viện, trung tâm đào tạo và các giải đấu.'],
            ['Đồng phục chạy bộ (Running)', 'Áo chạy bộ, áo giải chạy, trang phục đội tuyển và đồng phục sự kiện thể thao, chú trọng trọng lượng nhẹ, khả năng thoát mồ hôi và sự linh hoạt khi vận động.'],
            ['Đồng phục cầu lông, bóng đá và thể thao đồng đội', 'Trang phục thi đấu, tập luyện dành cho câu lạc bộ, đội nhóm phong trào và các tổ chức thể thao.'],
            ['Đồng phục MMA & Boxing', 'Trang phục tập luyện và thi đấu theo đặc thù bộ môn, ưu tiên độ bền, sự linh hoạt và khả năng chịu ma sát.'],
            ['Đồng phục Golf & thể thao ngoài trời', 'Áo polo, áo thể thao và trang phục dành cho câu lạc bộ, đội nhóm và sự kiện thể thao.'],
            ['Đồng phục huấn luyện viên', 'Trang phục chuyên nghiệp dành cho PT, HLV Gym, Yoga, Pilates, Fitness và các bộ môn thể thao khác.'],
          ],
          customers: [
            'Chuỗi phòng tập Gym, Fitness Center, Yoga Studio và Pilates Studio.',
            'Câu lạc bộ Pickleball, Tennis, cầu lông và các cộng đồng thể thao.',
            'Trung tâm đào tạo, học viện và đội ngũ huấn luyện viên.',
            'Doanh nghiệp tổ chức giải thể thao, sự kiện vận động và hoạt động nội bộ.',
            'Các đội nhóm, cộng đồng yêu thể thao và cá nhân kinh doanh trong lĩnh vực thể thao.',
          ],
          closing: <>Với mỗi đối tác, Univi hướng đến giải pháp đồng phục có <strong className="text-[#105d97]">tính đồng bộ về nhận diện thương hiệu</strong>, phù hợp với đặc thù vận động và có khả năng triển khai theo quy mô từ đội nhóm đến hệ thống nhiều cơ sở.</>,
          galleryTitle: 'Thư viện ảnh Đồng phục Thể Thao',
          photos: SPORTS_GALLERY_PHOTOS,
        },
        {
          n: '2',
          title: '2. Đồng phục doanh nghiệp - Giải pháp nhận diện thương hiệu',
          intro: [
            <><Link href="/dong-phuc-doanh-nghiep" legacyBehavior><a className="text-blue-600 hover:underline">Đồng phục doanh nghiệp</a></Link> là một trong những lĩnh vực hoạt động của Univi, hướng đến nhu cầu xây dựng hình ảnh chuyên nghiệp, thống nhất và có bản sắc riêng cho các tổ chức, công ty và đội ngũ nhân sự.</>,
            <>Univi hiểu rằng đồng phục không đơn thuần là trang phục làm việc mà còn là <strong className="text-[#105d97]">một phần trong hệ thống nhận diện thương hiệu</strong>, thể hiện văn hóa doanh nghiệp và tạo sự gắn kết giữa các thành viên.</>,
            <>Từ khâu tư vấn kiểu dáng, lựa chọn chất liệu, phối màu đến thiết kế logo và hoàn thiện sản phẩm, Univi hướng đến giải pháp đồng phục phù hợp với đặc điểm ngành nghề, môi trường làm việc và ngân sách của từng doanh nghiệp.</>,
          ],
          productsTitle: 'Các dòng đồng phục doanh nghiệp Univi cung cấp:',
          products: [
            ['Đồng phục áo polo doanh nghiệp', 'Thiết kế thanh lịch, năng động, phù hợp với nhân viên văn phòng, đội ngũ kinh doanh, quản lý và các hoạt động giao tiếp khách hàng.'],
            ['Đồng phục áo thun doanh nghiệp', 'Áo thun cổ tròn, cổ tim và các thiết kế theo yêu cầu, phù hợp với môi trường làm việc năng động, hoạt động nội bộ và truyền thông thương hiệu.'],
            ['Đồng phục sơ mi công sở', 'Trang phục dành cho nhân viên văn phòng, bộ phận kinh doanh, lễ tân và đội ngũ quản lý.'],
            ['Đồng phục vest công sở', 'Giải pháp trang phục lịch sự, chuyên nghiệp dành cho cấp quản lý, nhân sự văn phòng và các vị trí thường xuyên tiếp xúc đối tác.'],
            ['Đồng phục teambuilding', 'Áo nhóm, áo sự kiện, áo du lịch và trang phục dành cho các chương trình gắn kết nội bộ.'],
            ['Đồng phục sự kiện và quảng bá', 'Trang phục dành cho hội nghị, triển lãm, chương trình ra mắt sản phẩm, hoạt động tiếp thị và sự kiện thương hiệu.'],
            ['Đồng phục nhân viên theo ngành nghề', 'Thiết kế theo yêu cầu sử dụng và đặc điểm nhận diện của từng doanh nghiệp.'],
          ],
          customers: [
            'Doanh nghiệp vừa và nhỏ, tập đoàn và hệ thống chuỗi.',
            'Công ty thương mại, dịch vụ, sản xuất và công nghệ.',
            'Ngân hàng, tổ chức tài chính và đơn vị kinh doanh.',
            'Khách sạn, nhà hàng, khu nghỉ dưỡng và dịch vụ du lịch.',
            'Đơn vị tổ chức sự kiện, truyền thông và quảng cáo.',
          ],
          closing: <>Univi hướng đến việc giúp doanh nghiệp <strong className="text-[#105d97]">xây dựng hình ảnh đồng bộ</strong> thông qua những bộ đồng phục được thiết kế riêng, thể hiện màu sắc thương hiệu và phù hợp với từng vị trí công việc.</>,
          galleryTitle: 'Thư viện ảnh Đồng phục Doanh Nghiệp',
          photos: ENTERPRISE_GALLERY_PHOTOS,
        },
        {
          n: '3',
          title: '3. Các dòng đồng phục chuyên biệt khác',
          intro: [
            <>Bên cạnh hai lĩnh vực trọng tâm, Univi còn phát triển các dòng đồng phục theo yêu cầu dành cho trường học, gia đình, tổ chức cộng đồng và những môi trường hoạt động đặc thù.</>,
            <>Mỗi nhóm sản phẩm có yêu cầu riêng về thiết kế, chất liệu, độ bền và tính tiện dụng. Univi tư vấn giải pháp dựa trên mục đích sử dụng, độ tuổi người mặc, môi trường hoạt động và ngân sách triển khai.</>,
          ],
          productsTitle: 'Các dòng sản phẩm tiêu biểu:',
          products: [
            ['Đồng phục học sinh', 'Áo polo, áo thun, áo sơ mi và trang phục dành cho học sinh, trường học, trung tâm đào tạo.'],
            ['Đồng phục gia đình', 'Trang phục đồng bộ dành cho các thành viên trong gia đình, sử dụng trong du lịch, nghỉ dưỡng và các dịp kỷ niệm.'],
            ['Đồng phục du lịch', 'Áo nhóm, áo đoàn và trang phục dành cho các chuyến du lịch, hoạt động tập thể.'],
            ['Đồng phục họp lớp', 'Trang phục thiết kế riêng cho các chương trình gặp mặt, kỷ niệm ngày ra trường và hoạt động hội khóa.'],
            ['Đồng phục cộng đồng', 'Áo nhóm, áo thiện nguyện và trang phục dành cho các chương trình xã hội, hoạt động vì cộng đồng.'],
            ['Đồng phục bảo hộ lao động', 'Trang phục phục vụ môi trường làm việc đặc thù, được tư vấn theo yêu cầu về chất liệu, kiểu dáng và tính năng sử dụng.'],
          ],
          customers: null,
          closing: <>Univi chú trọng <strong className="text-[#105d97]">tính linh hoạt trong thiết kế và khả năng cá nhân hóa</strong>, giúp mỗi tổ chức có được sản phẩm đồng phục phù hợp với mục đích sử dụng và đặc trưng riêng.</>,
          galleryTitle: 'Thư viện ảnh Đồng phục Khác & Sự Kiện',
          photos: OTHER_GALLERY_PHOTOS,
        },
      ].map(({ n, title, intro, productsTitle, products, customers, closing, galleryTitle, photos }) => (
        <section key={n} className="py-6 px-4 md:px-12 container mx-auto">
          <h3 className="text-xl font-medium text-gray-900 mb-6">{title}</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              {intro.map((para, i) => <p key={i} className="text-gray-700 leading-6 text-base">{para}</p>)}
              <div>
                <p className="font-medium text-gray-900 mb-2">{productsTitle}</p>
                <ul className="space-y-2 text-base">
                  {products.map(([label, desc]) => (
                    <Bullet key={label}><span><strong className="text-[#105d97]">{label}:</strong> {desc}</span></Bullet>
                  ))}
                </ul>
              </div>
              {customers && (
                <div>
                  <p className="font-medium text-gray-900 mb-2">Đối tượng khách hàng:</p>
                  <ul className="space-y-2 text-base">
                    {customers.map((c) => <Bullet key={c}>{c}</Bullet>)}
                  </ul>
                </div>
              )}
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
              <p className="text-gray-700 leading-6 font-medium">{closing}</p>
            </div>
          </div>
          <CategoryGallerySection title={galleryTitle} photos={photos} />
        </section>
      ))}

      {/* Giải pháp đồng phục theo yêu cầu */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <h3 className="text-xl font-medium text-gray-900 mb-6">Giải pháp đồng phục theo yêu cầu từ Univi</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <p className="text-gray-700 leading-6 text-base">
              Dù thuộc lĩnh vực thể thao, doanh nghiệp hay các dòng đồng phục chuyên biệt, Univi đều hướng đến việc cung cấp <strong className="text-[#105d97]">giải pháp xuyên suốt</strong> từ tư vấn, thiết kế, lựa chọn nguyên phụ liệu, phát triển mẫu đến sản xuất và kiểm soát chất lượng.
            </p>
            <p className="text-gray-700 leading-6 text-base">
              Mỗi đơn hàng được tiếp cận dựa trên nhu cầu thực tế, số lượng, ngân sách, đặc điểm sử dụng và định hướng nhận diện thương hiệu của khách hàng.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <p className="text-gray-700 leading-6 font-medium">
              <strong className="text-[#105d97]">Đồng Phục Univi - TIÊN PHONG cung cấp giải pháp đồng phục thể thao chuyên nghiệp</strong>, đồng hành cùng doanh nghiệp, tổ chức và cộng đồng trong hành trình xây dựng hình ảnh thương hiệu thông qua đồng phục.
            </p>
          </div>
        </div>
      </section>

      {/* VII. Cam kết */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VII." title="Cam kết của Univi" />

        <div className="space-y-4">
          <StepCard number="1" title="Thông Tin Rõ Ràng">
            <p className="text-gray-700 leading-6">
              Khi lựa chọn Đồng phục Univi, quý khách sẽ hoàn toàn yên tâm về sự minh bạch của chúng tôi. Tất cả thông tin liên quan như địa chỉ, số điện thoại, và tài khoản ngân hàng đều được công khai chi tiết.
            </p>
          </StepCard>
          <StepCard number="2" title="Chất Lượng Sản Phẩm Đặt Lên Hàng Đầu">
            <p className="text-gray-700 leading-6 mb-3">
              Chất lượng áo từ Đồng Phục Univi không chỉ đáp ứng yêu cầu mà còn cam kết không tính phí nếu sản phẩm không đạt chuẩn.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <strong>Các dòng vải cao cấp tại Univi:</strong> Polyamide, Polyester cao cấp (PET), Cotton 100%, Piquecool, Lacoste USA,…
            </div>
          </StepCard>
        </div>

        <div className="space-y-4">
          <StepCard number="3" title="An toàn với sức khỏe người mặc">
            <p className="text-gray-700 leading-6">Chất liệu được lựa chọn theo nhu cầu vận động và tư vấn theo từng mã vải.</p>
          </StepCard>


          <StepCard number="4" title="Giá Cả Hợp Lý, Báo Giá Rõ Ràng">
            <p className="text-gray-700 leading-6">
              Giá được tư vấn theo sản phẩm, chất liệu, số lượng và yêu cầu hoàn thiện. Một số sản phẩm có giá tham khảo từ <strong className="text-[#105d97]">99.000đ</strong>; báo giá chính thức được xác nhận theo từng đơn hàng.
            </p>
          </StepCard>
          <StepCard number="5" title="Chế Độ Bảo Hành và Hậu Mãi" accent>
            <p className="text-gray-700 leading-6">
              Univi bảo hành chất lượng áo, logo,…, đội ngũ chăm sóc khách hàng chuyên nghiệp sẵn sàng hỗ trợ mọi vấn đề và giải đáp mọi thắc mắc của quý khách hàng.
            </p>
          </StepCard>
        </div>
      </section>

      {/* VIII. Univi vì cộng đồng */}
      <section className="py-6 pb-20 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VIII." title="Univi vì cộng đồng" />

        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-[#105d97] mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#105d97] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700 leading-6 text-base">
              <strong className="text-[#105d97]">Quỹ UNIVI vì cộng đồng</strong> được sáng lập ngày <strong className="text-[#105d97]">9/12/2023</strong> bởi thương hiệu Đồng phục UNIVI. Mục đích của quỹ nhằm hỗ trợ và giúp đỡ trẻ mồ côi, gia đình có hoàn cảnh khó khăn trên khắp mọi miền của Tổ Quốc.
            </p>
          </div>
        </div>

        <figure className="max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-sm">
            <Image src="/images/gioi-thieu/univi-vi-cong-dong.jpg" alt="Quỹ UNIVI vì cộng đồng"
              width={800} height={400} layout="responsive" sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-xl" />
          </div>
        </figure>
      </section>
    </article>
  );
}
