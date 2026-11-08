import { FaPhoneAlt, FaFileInvoice } from "react-icons/fa";
import { COMPANY_INFO } from "../../lib/companyInfo";
import { trackPhoneClick, trackZaloClick } from "../../lib/meta-pixel";

// Thanh CTA cố định cuối màn hình, chỉ hiện trên mobile (< 768px) ở trang chi tiết sản phẩm.
// Thay cho nút Zalo/Messenger nổi (bị ẩn trên mobile ở route này, xem MessengerButton).
// Trang dùng component này cần thêm padding-bottom (pb-20 md:pb-0) để nội dung không bị che.
export default function MobileStickyCTA({ onQuoteClick, source = "product_sticky_bar" }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-3 pt-2 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      role="region"
      aria-label="Liên hệ nhanh"
    >
      <div className="grid grid-cols-2 gap-2">
        {/* Gọi / Zalo: một nút, hai đích — gọi điện và Zalo */}
        <div className="flex h-12 overflow-hidden rounded-lg border border-[#105d97] text-[#105d97]">
          <a
            href={COMPANY_INFO.hotlineTel}
            onClick={() => trackPhoneClick(COMPANY_INFO.hotline, { source })}
            className="flex flex-1 items-center justify-center gap-1.5 text-sm font-semibold active:bg-[#eaf2fb]"
            aria-label={`Gọi ${COMPANY_INFO.hotline}`}
          >
            <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden="true" />
            Gọi
          </a>
          <span className="w-px bg-[#105d97]/30" aria-hidden="true" />
          <a
            href={COMPANY_INFO.social.zalo}
            target="_blank"
            rel="noopener noreferrer"
            data-meta-tracked="true"
            onClick={() => trackZaloClick({ source })}
            className="flex flex-1 items-center justify-center text-sm font-semibold active:bg-[#eaf2fb]"
            aria-label={`Nhắn Zalo ${COMPANY_INFO.hotline}`}
          >
            Zalo
          </a>
        </div>

        <button
          type="button"
          onClick={onQuoteClick}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-[#105d97] text-sm font-semibold text-white active:bg-[#0d4c7a]"
        >
          <FaFileInvoice className="h-4 w-4" aria-hidden="true" />
          Nhận báo giá nhanh
        </button>
      </div>
    </div>
  );
}
