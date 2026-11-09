import Link from "next/link";
import Image from "next/image";

// Danh sách sản phẩm theo danh mục cho trang /san-pham — render ở server (SSR) để
// HTML có link tới từng sản phẩm và từng trang danh mục. Dữ liệu: getServerSideProps
// của pages/san-pham/index.js (buildProductHubGroups).
const resolveImage = (src) => {
  if (!src) return "/images/placeholder.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `/${src}`;
};

export default function ProductHubSection({ groups = [] }) {
  if (!Array.isArray(groups) || groups.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8 md:py-12" aria-labelledby="product-hub-title">
      <h2 id="product-hub-title" className="text-xl md:text-2xl font-bold text-[#0B1E48] mb-6">
        Sản phẩm đồng phục theo danh mục
      </h2>

      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.key}>
            <div className="flex items-baseline justify-between gap-4 mb-4 border-b border-gray-200 pb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                <Link href={group.href} className="hover:text-[#105d97]">
                  {group.title}
                </Link>
              </h3>
              <Link href={group.href} className="text-sm font-medium text-[#105d97] hover:underline whitespace-nowrap">
                Xem tất cả {group.total} sản phẩm →
              </Link>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.products.map((p) => {
                const img = resolveImage(p.image);
                return (
                  <li key={p.slug}>
                    <Link href={`/san-pham/${p.slug}`} className="group block">
                      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                        <Image
                          src={img}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-500 group-hover:scale-[1.03]"
                          unoptimized={img.startsWith("http://") || img.startsWith("https://")}
                        />
                      </div>
                      <p className="mt-2 text-sm md:text-base font-medium text-gray-800 group-hover:text-[#105d97] line-clamp-2">
                        {p.name}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
