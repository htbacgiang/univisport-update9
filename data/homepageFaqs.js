// FAQ trang chủ mặc định: dùng khi DB chưa có bản ghi `homepagefaqsettings`
// hoặc khi trang chủ không đọc được DB. Giữ nội dung KHỚP với bản trong DB.
// Chốt ngày 09/11/2026 theo reports/homepage-faq-2026-11-09/faq-review.md (chỉ dùng dữ kiện có nguồn).
export const DEFAULT_CLOUDINARY_VIDEO =
  "https://res.cloudinary.com/djwdvetlr/video/upload/q_auto,vc_auto/v1787114111/BEST-SELLER_zla1jb.mp4";

const faq = (
  question,
  answer,
  order,
  video = DEFAULT_CLOUDINARY_VIDEO,
  image = "/images/thumb-univi.jpg"
) => ({
  question,
  answer,
  image,
  video,
  isVisible: true,
  order,
});

export const DEFAULT_HOMEPAGE_FAQS = [
  faq(
    "Đồng Phục Univi sản xuất những dòng đồng phục nào?",
    "Hai dòng sản phẩm chủ lực được Univi tập trung nghiên cứu và phát triển chuyên sâu là Áo Gym chuyên dụng (dành cho chuỗi phòng tập, huấn luyện viên PT tối ưu hiệu suất tập luyện và khẳng định uy tín phòng tập) và Áo Polo thể thao - công sở chất lượng cao (vải thoát ẩm, thoáng khí, bề mặt mềm mịn, không gây kích ứng da, phù hợp cho cả chơi thể thao lẫn môi trường văn phòng). Bên cạnh đó, Univi sản xuất trực tiếp đồng phục Yoga, Pilates, Pickleball, chạy bộ, MMA, áo sơ mi, áo gió, bảo hộ lao động và quà tặng doanh nghiệp.",
    0,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794297156/san-pham-chu-luc_nprt8w.mp4"
  ),
  faq(
    "Số lượng đặt may tối thiểu tại Univi là bao nhiêu?",
    "Univi nhận đơn chỉ từ 10 sản phẩm đối với các mẫu và dòng vải có sẵn, rất phù hợp cho các phòng Gym Private dưới 10 nhân sự. Thay vì để mỗi nhân sự mặc một kiểu thiếu đồng bộ, Univi đã thiết kế sẵn hàng trăm concept chia theo 3 vị trí: (1) PT & Coach mặc áo thun hoặc áo polo thể thao form fitness tôn dáng, khỏe khoắn, thoải mái vận động cả ngày; (2) Lễ tân, Sale & CSKH mặc áo polo thể thao cao cấp tạo sự thân thiện, chỉn chu ngay điểm chạm đầu tiên; (3) Chủ phòng tập & Quản lý mặc dòng polo cao cấp riêng để thể hiện vai trò quản lý và nâng tầm thương hiệu. Chủ phòng tập chỉ cần cung cấp phân khúc khách hàng và màu nhận diện để Univi phối sẵn bộ concept tiết kiệm chi phí nhất.",
    1,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794487336/so-luong-dat-hang_azmhyz.mp4"
  ),

  faq(
    "Chất liệu vải đồng phục của Univi có gì khác biệt?",
    "Thay vì dùng một loại vải phổ biến áp cho mọi khách hàng, đội ngũ R&D của Univi nghiên cứu chất liệu đi từ bài toán thực tế của người mặc cuối cùng: Người tập Gym cần form ôm body tôn dáng nhưng co giãn thoải mái; Huấn luyện viên (PT) mặc cả ngày ưu tiên độ khô thoáng và khử mùi; đồ Chạy bộ (Running) ưu tiên sự nhẹ nhàng, giảm ma sát; còn Áo Polo quản lý cần sự đứng form, lịch sự và chỉn chu. Từ đó, Univi phát triển các dòng vải chuyên biệt như UNI SUPER COOL, UNI QUICK DRY và công nghệ thoát ẩm một chiều UNI DRY cho từng vị trí và bộ môn.",
    2,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794297796/TH_07_fzxmov.mp4"
    // TH-07
  ),
  faq(
    "Quy trình và thời gian sản xuất một đơn đồng phục mất bao lâu?",
    "Thời gian nhận hàng phụ thuộc vào mẫu mã khách hàng lựa chọn: Đối với các mẫu Univi đã sản xuất có sẵn trong kho, thời gian nhận hàng chỉ khoảng 3-5 ngày. Đối với các mẫu thiết kế riêng cần chờ sản xuất mới, thời gian dao động từ 10-12 ngày. Quy trình khép kín gồm: lên đơn theo market, lấy vải và nguyên phụ liệu, cắt, may, in/thêu, là ủi - đóng gói và giao hàng. Xưởng may rộng 2.000 m² tại Chương Mỹ, Hà Nội với hơn 100 thợ lành nghề, năng lực sản xuất đạt trên 4.000 sản phẩm/ngày.",
    3,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794443997/quy-trinh-san-xuat_wggxsf.mp4"
  ),
  faq(
    "Chất liệu vải đồng phục thể thao chuyên dụng của Univi có gì khác biệt?",
    "Thay vì dùng một loại vải đại trà áp cho mọi khách hàng, đội ngũ R&D của Univi nghiên cứu chất liệu đi từ bài toán của người mặc cuối cùng (người tập Gym cần ôm body co giãn, PT cần khô thoáng khử mùi cả ngày, Running cần nhẹ giảm ma sát, Polo quản lý cần lịch sự chỉn chu). Univi phát triển 2 dòng vải độc quyền là UNI SUPER COOL và UNI QUICK DRY (kết hợp công nghệ thoát ẩm một chiều UNI DRY), dệt từ sợi Polyamide và Polyester cao cấp với trọng lượng siêu nhẹ chỉ bằng 1/3 vải thông thường, giúp tối ưu chuyển động và tăng hiệu suất tập luyện. Đặc biệt, vải được kiểm định giới hạn hàm lượng Formaldehyde và Amin thơm từ thuốc nhuộm Azo (2 tác nhân tiềm ẩn nguy cơ kích ứng và ung thư da), đảm bảo an toàn cho sức khỏe và giữ form bền bỉ suốt 1 năm sử dụng mà không bị bai dão.",
    4,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794487356/vai-the-thao-chuyen-dung-univi_nfk6pi.mp4"
  ),

  faq(
    "Univi có giao hàng toàn quốc và cho duyệt mẫu trước không?",
    "Có. Univi giao hàng toàn quốc từ Hà Nội (Văn phòng: Nhà D14, ngõ 180 Thanh Bình, phường Hà Đông). Vì hình ảnh qua camera không thể truyền tải hết độ nhẹ của vải, độ co giãn, đường may chần êm ái hay cảm giác ôm form khi vận động thực tế, Univi luôn khuyến khích và hỗ trợ gửi catalog vải cùng áo mẫu tận nơi. Khách hàng được trực tiếp chạm, kéo giãn và mặc vận động thử trong 30 giây để cảm nhận sự khác biệt trước khi duyệt sản xuất hàng loạt.",
    5,
    "https://res.cloudinary.com/djwdvetlr/video/upload/v1794297916/TranHien14_yhu1eh.mp4"
  ),

];
