import { FC } from "react";
import Link from "next/link";

// Phân trang dạng <Link href> (render <a href> thật trong HTML SSR) để crawler đi được
// tới mọi trang. Dùng cho trang công khai; trang dashboard vẫn dùng Pagination.tsx (button).

interface LinkPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Trả về URL cho trang `page`. Trang 1 nên trả URL gốc (không ?page=1). */
  buildHref: (page: number) => string;
  /** Mặc định Next.js cuộn lên đầu trang sau khi chuyển trang. */
  scroll?: boolean;
  ariaLabel?: string;
}

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 1;
  const items: PageItem[] = [1];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);
  if (start > 2) items.push("ellipsis-left");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push("ellipsis-right");
  items.push(total);
  return items;
}

const baseItem =
  "min-w-9 h-9 px-3 rounded-full text-sm font-medium transition-colors flex items-center justify-center";
const idleItem = "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-[#105d97]";

const LinkPagination: FC<LinkPaginationProps> = ({
  currentPage,
  totalPages,
  buildHref,
  scroll,
  ariaLabel = "Phân trang",
}) => {
  if (totalPages <= 1) return null;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={ariaLabel} className="mt-8">
      <ul className="flex flex-wrap justify-center items-center gap-2">
        <li>
          {hasPrev ? (
            <Link href={buildHref(currentPage - 1)} scroll={scroll} rel="prev" className={`${baseItem} ${idleItem}`}>
              ← Trước
            </Link>
          ) : (
            <span className={`${baseItem} border border-gray-100 text-gray-300 cursor-not-allowed`} aria-disabled="true">
              ← Trước
            </span>
          )}
        </li>
        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              {item === currentPage ? (
                <span aria-current="page" className={`${baseItem} bg-[#105d97] text-white shadow-md`}>
                  {item}
                </span>
              ) : (
                <Link
                  href={buildHref(item)}
                  scroll={scroll}
                  aria-label={`Trang ${item}`}
                  className={`${baseItem} ${idleItem}`}
                >
                  {item}
                </Link>
              )}
            </li>
          ) : (
            <li key={item} aria-hidden="true" className="px-1 text-gray-400">
              …
            </li>
          )
        )}
        <li>
          {hasNext ? (
            <Link href={buildHref(currentPage + 1)} scroll={scroll} rel="next" className={`${baseItem} ${idleItem}`}>
              Sau →
            </Link>
          ) : (
            <span className={`${baseItem} border border-gray-100 text-gray-300 cursor-not-allowed`} aria-disabled="true">
              Sau →
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default LinkPagination;
