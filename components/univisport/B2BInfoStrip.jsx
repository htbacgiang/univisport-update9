import { FaBoxes, FaClock, FaIndustry, FaMapMarkerAlt } from "react-icons/fa";
import { COMPANY_INFO } from "../../lib/companyInfo";

// Dải thông số sản xuất B2B dùng chung (trang chủ + toàn bộ trang danh mục).
// Nội dung lấy từ COMPANY_INFO.productionFacts để mọi trang hiển thị cùng một bộ số liệu.
const ICONS = {
  moq: FaBoxes,
  leadTime: FaClock,
  factory: FaIndustry,
  office: FaMapMarkerAlt,
};

export default function B2BInfoStrip({ className = "" }) {
  return (
    <section
      aria-label="Thông tin sản xuất Đồng Phục Univi"
      className={`rounded-xl border border-[#d6e6f4] bg-[#f4f9fd] ${className}`}
    >
      <dl className="grid grid-cols-2 divide-[#d6e6f4] lg:grid-cols-4 lg:divide-x">
        {COMPANY_INFO.productionFacts.map(({ key, label, value }, index) => {
          const Icon = ICONS[key] || FaIndustry;
          return (
            <div
              key={key}
              className={`flex items-start gap-2.5 p-3 sm:p-4 ${index % 2 === 1 ? "border-l border-[#d6e6f4]" : ""} ${index >= 2 ? "border-t border-[#d6e6f4] lg:border-t-0" : ""}`}
            >
              <span
                className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#105d97] text-white"
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#105d97] sm:text-xs">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[13px] font-semibold leading-snug text-gray-900 sm:text-sm">
                  {value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
