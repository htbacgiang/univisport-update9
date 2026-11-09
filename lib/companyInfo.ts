/**
 * Single Source of Truth for Company NAP (Name, Address, Phone), Legal Identity, and Facilities.
 * All components, pages, and schema generators must reference this configuration.
 */

export const COMPANY_INFO = {
  name: "Đồng Phục Univi",
  legalName: "Công ty Cổ phần Tập đoàn Unicore Holdings",
  brandName: "Univi Uniform",
  taxCode: "0111401705",
  foundingYear: "2017",
  slogan: "YOUR UNIFORM, YOUR BRAND!",
  hotline: "0834.204.999",
  hotlineFormatted: "0834.204.999",
  hotlineTel: "tel:0834204999",
  salesPhone: "0961.567.997",
  salesPhoneFormatted: "0961.567.997",
  email: "dongphucunivi@gmail.com",
  emailMailto: "mailto:dongphucunivi@gmail.com",
  website: "https://dongphucunivi.com",

  // ── NAP (Name - Address - Phone) ───────────────────────────
  office: {
    label: "Văn phòng giao dịch",
    address: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội",
    shortAddress: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, Hà Nội",
    streetAddress: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông",
    addressLocality: "Hà Đông",
    addressRegion: "Hà Nội",
    postalCode: "100000",
    addressCountry: "VN",
    geo: {
      latitude: 20.9832437,
      longitude: 105.7788691,
    },
  },

  factory: {
    label: "Xưởng sản xuất",
    address: "Phường Chương Mỹ, Thành phố Hà Nội",
    shortAddress: "Phường Chương Mỹ, Hà Nội",
    streetAddress: "Phường Chương Mỹ",
    addressLocality: "Chương Mỹ",
    addressRegion: "Hà Nội",
    postalCode: "100000",
    addressCountry: "VN",
    area: "2.000m²",
    capacity: "100.000 sản phẩm/tháng",
  },

  // ── Thông số sản xuất B2B hiển thị trên B2BInfoStrip (trang chủ + danh mục) ──
  // Lưu ý: MOQ và tiến độ còn lệch giữa các nguồn (xem docs/knowledge/27-can-xac-minh.md mục 4–5).
  // Sửa tại đây là đổi đồng loạt trên mọi trang.
  productionFacts: [
    { key: "moq", label: "Đặt may tối thiểu", value: "Từ 10 sản phẩm" },
    { key: "leadTime", label: "Thời gian sản xuất", value: "7–12 ngày" },
    { key: "factory", label: "Năng lực xưởng", value: "Xưởng 2.000 m² tại Chương Mỹ (100.000 SP/tháng)" },
    { key: "office", label: "Văn phòng HN", value: "Nhà D14, ngõ 180 Thanh Bình, Hà Đông" },
  ],

  workingHours: {
    weekdays: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    // Chốt 09/11/2026: làm việc Thứ 2 – Thứ 7, Chủ nhật nghỉ (khớp openingHoursSpecification trong _app.js)
    weekend: "Chủ nhật: Nghỉ",
    allWeek: "08:00 - 18:00 (T2 - T7)",
    text: "08:00 - 18:00",
    days: "T2 - T7",
  },

  founder: {
    name: "Trần Hiền",
    jobTitle: "Đồng sáng lập & CEO",
    // Canonical Person entity lives on the author page (/tac-gia/tran-hien).
    // Article.author, the author page ProfilePage and the pillars must all use these.
    url: "https://dongphucunivi.com/tac-gia/tran-hien",
    id: "https://dongphucunivi.com/tac-gia/tran-hien#person",
    slug: "tran-hien",
    founderPageUrl: "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien",
    // Nguồn: bài /dong-sang-lap-univi-sport-tran-hien ("Tốt nghiệp Đại học Dược Hà Nội năm 2016")
    // và docs/knowledge/26-founder-tran-hien.md. Chỉ thêm dữ kiện đã có nguồn.
    alumniOf: "Trường Đại học Dược Hà Nội",
    // Hồ sơ mạng xã hội cá nhân được liệt kê trong bài sáng lập
    sameAs: [
      "https://www.facebook.com/hienunivi",
      "https://www.instagram.com/dstranhien",
    ],
    knowsAbout: [
      "Chất liệu vải thể thao",
      "Vải thoát ẩm UNI DRY",
      "Đồng phục Gym, Yoga, Pilates, Pickleball",
      "Đồng phục doanh nghiệp",
      "Sản xuất may mặc B2B",
    ],
  },

  social: {
    facebook: "https://facebook.com/Dongphucunivi",
    youtube: "https://youtube.com/@dongphucunivi",
    zalo: "https://zalo.me/0834204999",
    linkedin: "https://www.linkedin.com/company/univi-uniform",
    instagram: "https://instagram.com/dongphucunivi",
  },
};

export default COMPANY_INFO;
