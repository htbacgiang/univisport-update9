import Link from 'next/link';
import { COMPANY_INFO } from '../../lib/companyInfo';

// Bản văn bản (HTML) của Hồ sơ năng lực 2026 — hiển thị dạng <details> thu gọn bên dưới trình xem PDF.
// Nội dung nằm trong HTML SSR nên Googlebot / AI search đọc được, đồng thời người dùng mở ra xem được
// (KHÔNG dùng sr-only: ẩn ~1.000 từ khỏi người dùng là hidden text theo chính sách spam của Google).
//
// Nguồn: public/ho-so-nang-luc.pdf (đối chiếu từng trang 09/11/2026), CHỈNH theo dữ kiện đã duyệt:
//  - Xưởng: "khoảng 2.000 m² tại Chương Mỹ" (BĐH duyệt) — PDF còn ghi Đan Phượng (cũ).
//  - Công suất: "khoảng 100.000 sp/tháng" (BĐH duyệt) + "trên 4.000 sp/ngày" (PDF).
//  - Số thợ: "khoảng 100" (docs/knowledge/03 — số 100+ chưa xác minh).
//  - Pháp nhân/NAP: lib/companyInfo.ts (Unicore Holdings từ 3/2026) — PDF còn ghi Bảo Phong Evenes.
//  - Bỏ các claim "số 1", "hàng đầu", "giá thành cạnh tranh nhất", "100% đầu ra".
//  - Khách hàng: chỉ những tên có trong PDF.
// Khi hồ sơ PDF được cập nhật, sửa file này cho khớp.

const ECOSYSTEM = [
  ['UNIVI SPORT', 'đồng phục và trang phục thể thao'],
  ['UNIVI UNIFORM', 'đồng phục doanh nghiệp, tổ chức'],
  ['UNIVI OFFICE', 'thời trang công sở'],
  ['UNIVI ELEGANT', 'dòng sản phẩm thanh lịch'],
  ['UNIVI KIDS', 'trang phục trẻ em'],
  ['UNIVI UNDERWEAR', 'đồ lót, đồ mặc nhà'],
];

const CORE_VALUES = [
  ['Chân thành', 'Nghĩ thẳng – Nói thật'],
  ['Kỷ luật', 'Nghĩ chuẩn – Làm đúng'],
  ['Quyết liệt', 'Nghĩ nhanh – Làm nhanh'],
  ['Trách nhiệm', 'Nghĩ tới – Làm tới'],
  ['Sáng tạo', 'Nghĩ khác – Làm mới'],
];

const DEPARTMENTS = [
  ['Bộ phận Điều phối', 'Đầu mối điều phối nguyên phụ liệu và toàn bộ quy trình sản xuất, đảm bảo mỗi đơn hàng được triển khai đúng từng mã sản phẩm và hoàn thiện đúng tiến độ. Toàn bộ quá trình được quản lý trên hệ thống CRM nội bộ.'],
  ['Bộ phận Kho', 'Kho dự trữ đa dạng vải và nguyên phụ liệu sẵn có, phục vụ đơn hàng lớn và đơn cần tiến độ gấp; sắp xếp theo quy chuẩn, dễ xuất nhập.'],
  ['Bộ phận Cắt', 'Bàn cắt rộng cùng máy cắt tự động chuyên dụng nhập khẩu, đảm bảo độ chính xác khi cắt bán thành phẩm.'],
  ['Bộ phận Mẫu và Kỹ thuật', 'Triển khai rập theo từng thiết kế, may mẫu và hướng dẫn kỹ thuật cho các bộ phận, chuẩn hóa form dáng và quy cách may trước khi sản xuất hàng loạt.'],
  ['Bộ phận May', 'Hệ thống máy may chuyên dụng cùng đội ngũ thợ may lành nghề, hoàn thiện tỉ mỉ từng đường kim mũi chỉ.'],
  ['Bộ phận In/Ép', 'Xử lý file thiết kế và vận hành máy in ép với nhiều công nghệ: in PET, in decal, in chuyển nhiệt, in nổi (silicone/TPU); kiểm soát độ sắc nét và độ bám của hình in.'],
  ['Bộ phận QC', 'Nhóm QC kiểm soát chất lượng từ bán thành phẩm đến thành phẩm trước khi chuyển sang công đoạn tiếp theo.'],
  ['Bộ phận Hoàn thiện', 'Kiểm tra chất lượng lần cuối, xử lý sai sót, gấp và đóng gói theo quy chuẩn bao bì Univi trước khi xuất xưởng.'],
];

const PROCESS = ['Lên đơn hàng theo market', 'Lấy vải và nguyên phụ liệu', 'Cắt', 'May', 'In/Thêu', 'Là, đóng gói và giao hàng'];

export default function CapabilityProfileText({ className = '' }) {
  const years = new Date().getFullYear() - Number(COMPANY_INFO.foundingYear);
  const { factory, office } = COMPANY_INFO;

  return (
    <details className={`group mt-6 rounded-xl overflow-hidden bg-[#0B1E48] text-white shadow-sm border border-slate-700/40 ${className}`}>
      <summary className="cursor-pointer list-none select-none px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3 text-sm sm:text-base font-semibold text-white bg-[#0B1E48] hover:bg-[#0e275d] transition-colors">
        <span>Xem nội dung hồ sơ năng lực dạng văn bản</span>
        <span aria-hidden="true" className="text-white transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>

      <article className="max-h-[500px] overflow-y-auto px-4 pb-6 pt-2 sm:px-6 text-sm sm:text-[15px] leading-relaxed text-white space-y-6 [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 border-t border-slate-700/40">
        <p className="pt-2 text-white text-xs sm:text-sm">
          Nội dung tóm tắt từ Hồ sơ năng lực Đồng phục Univi 2026 (bản PDF ở trên).
        </p>

        <section>
          <h2>Hệ sinh thái Univi và định hướng phát triển</h2>
          <p>
            Univi tập trung nghiên cứu và phát triển sản phẩm đồng phục thể thao, chú trọng vào chất liệu và mẫu
            mã phù hợp cho từng bộ môn. Mục tiêu dài hạn là trở thành công ty niêm yết trên sàn chứng khoán, đồng
            thời phát triển hệ sinh thái Univi.
          </p>
          <h3>Các thương hiệu trong hệ sinh thái</h3>
          <ul>
            {ECOSYSTEM.map(([brand, desc]) => (
              <li key={brand}><strong>{brand}</strong>: {desc}</li>
            ))}
          </ul>
          <h3>5 giá trị cốt lõi</h3>
          <ul>
            {CORE_VALUES.map(([value, motto]) => (
              <li key={value}><strong>{value}</strong>: {motto}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Xưởng sản xuất và năng lực sản xuất</h2>
          <ul>
            <li>
              Xưởng may khoảng {factory.area.replace('m²', ' m²')} tại {factory.addressLocality}, {factory.addressRegion},
              với khoảng 100 thợ may lành nghề.
            </li>
            <li>Năng lực sản xuất trên 4.000 sản phẩm/ngày, khoảng {factory.capacity}, đáp ứng các đơn hàng lớn.</li>
            <li>Chủ động toàn bộ dây chuyền sản xuất, kiểm soát chất lượng đầu ra trước khi bàn giao và cam kết giao hàng đúng hạn.</li>
          </ul>
          <p className="mt-2">
            Xem thêm hình ảnh và quy trình tại trang{' '}
            <Link href="/xuong-may-dong-phuc-univi" className="text-white underline underline-offset-2 hover:text-blue-200 transition-colors">
              xưởng may đồng phục Univi
            </Link>.
          </p>
        </section>

        <section>
          <h2>Lĩnh vực hoạt động</h2>
          <h3>Đồng phục thể thao</h3>
          <ul>
            <li>Đồng phục HLV, PT dành cho các phòng tập</li>
            <li>Đồng phục đội nhóm Yoga, Pilates, Aerobic</li>
            <li>Đồng phục đội nhóm Pickleball, Tennis, Cầu lông, Bóng đá</li>
            <li>Đồng phục giải chạy bộ</li>
            <li>Đồng phục MMA, Boxing</li>
            <li>Đồng phục bơi, cứu hộ</li>
          </ul>
          <h3>Đồng phục doanh nghiệp</h3>
          <ul>
            <li>Áo thun, áo Polo, áo sơ mi, vest</li>
            <li>Đồng phục công sở, văn phòng</li>
            <li>Đồng phục team building, sự kiện</li>
          </ul>
          <h3>Đồng phục khác</h3>
          <ul>
            <li>Đồng phục trường học</li>
            <li>Đồng phục gia đình, du lịch, họp lớp</li>
            <li>Đồng phục ngành nghề, bảo hộ lao động</li>
          </ul>
          <h3>Danh mục sản phẩm trong hồ sơ</h3>
          <p>
            Đồng phục Polo doanh nghiệp; Polo thể thao, team building; sơ mi; vest công sở; áo gió doanh nghiệp và
            áo gió thể thao; phụ kiện, quà tặng; bảo hộ lao động cho công xưởng, nhà máy; Pickleball, Tennis; cầu
            lông, bóng đá; Gym, PT, HLV phòng tập; Yoga, Pilates.
          </p>
        </section>

        <section>
          <h2>Khách hàng tiêu biểu</h2>
          <p>
            Thành lập năm {COMPANY_INFO.foundingYear}, sau {years} năm trong lĩnh vực sản xuất đồng phục, Univi đã
            cung cấp đồng phục cho nhiều doanh nghiệp, tổ chức và phòng tập, trong đó có:
          </p>
          <ul>
            <li><strong>Doanh nghiệp, tổ chức:</strong> Sun Group, Vingroup, Hyundai Thành Công, Tập đoàn Than – Khoáng sản Việt Nam, Herbalife, Yến Sào Hoàng Việt, GHT Group.</li>
            <li><strong>Phòng tập, cộng đồng thể thao:</strong> The One Kickfit, Lif Up, Instructor Jumping, Ladysfit, Gofit, Funfit.</li>
          </ul>
        </section>

        <section>
          <h2>Nghiên cứu, phát triển và thiết kế theo yêu cầu</h2>
          <p>
            Univi có đội ngũ Nghiên cứu &amp; Phát triển sản phẩm (R&amp;D) chuyên trách cho đồng phục thể thao và
            đồng phục doanh nghiệp, liên tục cập nhật xu hướng thiết kế, chất liệu và công nghệ. Mỗi thiết kế theo
            yêu cầu được nghiên cứu từ concept, màu sắc, chất liệu đến hệ thống nhận diện thương hiệu của khách hàng.
          </p>
        </section>

        <section>
          <h2>8 bộ phận của khối sản xuất</h2>
          <ol>
            {DEPARTMENTS.map(([name, desc]) => (
              <li key={name}><strong>{name}:</strong> {desc}</li>
            ))}
          </ol>
          <h3>Quy trình sản xuất</h3>
          <p>{PROCESS.join(' → ')}. Các bộ phận vận hành trên phần mềm quản trị nội bộ.</p>
          <h3>Quy chuẩn an toàn lao động</h3>
          <p>
            Khối sản xuất áp dụng quy chuẩn an toàn cho hệ thống điện, máy móc và hóa chất; máy móc được kiểm tra,
            bảo dưỡng định kỳ; hóa chất được niêm yết nguồn gốc, thành phần và lưu trữ đúng quy chuẩn; người lao
            động được trang bị và tuân thủ quy định bảo hộ lao động.
          </p>
        </section>

        <section>
          <h2>Tầm nhìn chiến lược và trách nhiệm cộng đồng</h2>
          <ul>
            <li>Phát triển chuyên sâu mảng đồng phục thể thao tại Việt Nam.</li>
            <li>Kiến tạo hình ảnh thương hiệu cho doanh nghiệp thông qua đồng phục.</li>
            <li>Giải pháp &quot;Đồng phục toàn diện&quot; cho doanh nghiệp và đội nhóm.</li>
            <li>Đưa đồng phục thành ngôn ngữ truyền tải giá trị của doanh nghiệp, đội nhóm.</li>
          </ul>
          <h3>Quỹ Univi Vì Cộng Đồng</h3>
          <p>
            Univi trao học bổng định kỳ cho học sinh tại Trường PTDTBT TH Nậm Chảy và Trường THPT số 2 huyện
            Mường Khương (Lào Cai).
          </p>
        </section>

        <section>
          <h2>Thông tin liên hệ</h2>
          <ul>
            <li><strong>Pháp nhân:</strong> {COMPANY_INFO.legalName} (thương hiệu Đồng phục Univi), MST {COMPANY_INFO.taxCode}</li>
            <li><strong>{office.label}:</strong> {office.address}</li>
            <li><strong>{factory.label}:</strong> {factory.address}</li>
            <li>
              <strong>Hotline:</strong>{' '}
              <a href={COMPANY_INFO.hotlineTel} className="text-white underline underline-offset-2 hover:text-blue-200 transition-colors">{COMPANY_INFO.hotline}</a>
              {' – '}
              <a href={`tel:${COMPANY_INFO.salesPhone.replace(/\./g, '')}`} className="text-white underline underline-offset-2 hover:text-blue-200 transition-colors">{COMPANY_INFO.salesPhone}</a>
            </li>
            <li>
              <strong>Liên hệ báo giá:</strong>{' '}
              <Link href="/lien-he" className="text-white underline underline-offset-2 hover:text-blue-200 transition-colors">dongphucunivi.com/lien-he</Link>
            </li>
          </ul>
        </section>
      </article>
    </details>
  );
}
