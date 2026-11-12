import { useRouter } from 'next/router';

// Nút điều hướng tới URL LỌC (vd. /dong-phuc-gym?line=..&collar=..) KHÔNG render <a href>,
// để Googlebot không phát hiện/crawl các biến thể ?query (lãng phí crawl budget, trang trùng lặp).
// Trang lọc vẫn hoạt động bình thường cho người dùng; nếu bị truy cập trực tiếp, _app.js gắn
// robots "noindex, follow" và canonical về URL sạch.
// Chỉ dùng cho link lọc — link tới trang danh mục thật vẫn phải là <Link href>.
export default function FilterNavButton({
  href,
  shallow = false,
  onClick,
  className = '',
  children,
  ...rest
}) {
  const router = useRouter();

  const handleClick = (event) => {
    onClick?.(event);
    router.push(href, undefined, { shallow, scroll: !shallow });
  };

  return (
    <button type="button" onClick={handleClick} className={`text-left cursor-pointer ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** true nếu URL (string) có query string — dùng để chọn FilterNavButton thay cho <Link>. */
export const isFilterHref = (href) => typeof href === 'string' && href.includes('?');
