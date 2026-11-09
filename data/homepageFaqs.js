// FAQ trang chủ mặc định: dùng khi DB chưa có bản ghi `homepagefaqsettings`
// hoặc khi trang chủ không đọc được DB. Giữ nội dung KHỚP với bản trong DB.
// Chốt ngày 09/11/2026 theo reports/homepage-faq-2026-11-09/faq-review.md (chỉ dùng dữ kiện có nguồn).
const faq = (question, answer, order) => ({
  question,
  answer,
  image: "/images/thumb-univi.jpg",
  video: "",
  isVisible: true,
  order,
});

export const DEFAULT_HOMEPAGE_FAQS = [
  faq(
    "Đồng Phục Univi sản xuất những dòng đồng phục nào?",
    "Đồng Phục Univi là xưởng sản xuất trực tiếp hai nhóm sản phẩm: đồng phục thể thao chuyên dụng (áo PT, đồng phục phòng tập Gym, Yoga, Pilates, Pickleball, chạy bộ, MMA) và đồng phục doanh nghiệp (áo Polo công sở, đồng phục sự kiện, teambuilding), dùng các dòng vải thể thao của Univi.",
    0
  ),
  faq(
    "Số lượng đặt may tối thiểu tại Univi là bao nhiêu?",
    "Univi nhận đơn từ 10 sản phẩm với mẫu và vải có sẵn. Với đơn thiết kế riêng, Univi tư vấn số lượng tối thiểu theo từng mẫu khi trao đổi chi tiết.",
    1
  ),
  faq(
    "Chất liệu vải đồng phục của Univi có gì khác biệt?",
    "Univi dùng các dòng vải thể thao chuyên dụng như UNI SUPER COOL, UNI QUICK DRY và công nghệ thoát ẩm một chiều UNI DRY, giúp mồ hôi thoát ra ngoài thay vì thấm ngược vào da. Vải được kiểm định an toàn với da trước khi đưa vào sản xuất. Univi tư vấn dòng vải theo bộ môn và cường độ vận động.",
    2
  ),
  faq(
    "Quy trình và thời gian sản xuất một đơn đồng phục như thế nào?",
    "Quy trình gồm 5 bước: lên ý tưởng, thiết kế mockup (miễn phí), chọn chất liệu, sản xuất áo mẫu, kiểm tra và duyệt mẫu trước khi sản xuất toàn bộ đơn. Mẫu có sẵn được giao nhanh; với đơn thiết kế riêng, tiến độ phụ thuộc số lượng và thời điểm, Univi báo lịch cụ thể khi chốt đơn. Xưởng khoảng 2.000 m² tại Chương Mỹ, Hà Nội, công suất khoảng 100.000 sản phẩm/tháng.",
    3
  ),
  faq(
    "Chi phí may đồng phục tại Univi được tính như thế nào?",
    "Đơn giá phụ thuộc 4 yếu tố: dòng vải, kiểu dáng thiết kế, công nghệ in/thêu logo và tổng số lượng. Khách đặt trực tiếp tại xưởng Univi, không qua trung gian, và được xuất hoá đơn VAT. Liên hệ hotline 0834.204.999 để nhận báo giá chi tiết.",
    4
  ),
  faq(
    "Univi có giao hàng toàn quốc và cho duyệt mẫu trước không?",
    "Có. Univi giao hàng toàn quốc từ Hà Nội (văn phòng: Nhà D14, ngõ 180 Thanh Bình, phường Hà Đông). Trước khi sản xuất hàng loạt, khách nhận áo mẫu để kiểm tra form, đường may, màu sắc và logo, rồi duyệt lần cuối.",
    5
  ),
  faq(
    "Univi kiểm soát chất lượng sản phẩm như thế nào?",
    "Bộ phận QC của Univi kiểm soát chất lượng từ bán thành phẩm đến thành phẩm, trước mỗi công đoạn tiếp theo. Áo mẫu được khách duyệt trước khi sản xuất toàn bộ đơn. Điều kiện bảo hành chi tiết xem tại trang Chính sách bảo hành.",
    6
  ),
];
