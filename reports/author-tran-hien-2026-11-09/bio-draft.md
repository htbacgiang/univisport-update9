# Tiểu sử tác giả Trần Hiền: bản nháp chờ duyệt (09/11/2026)

Nơi lưu: Dashboard → Tác giả → Trần Hiền (collection `authors`, slug `tran-hien`).
Bio này hiện ở 3 chỗ: author box cuối mọi bài có tác giả Trần Hiền, trang `/tac-gia/tran-hien`, và `Person.description` trong schema.
Trang tác giả đã tự thêm link "Xem hồ sơ & hành trình sáng lập →" bằng code, nên không cần đặt link vào bio.

## Bản đề xuất (chỉ dùng dữ kiện có nguồn)

**Chức danh (role):** Đồng sáng lập Univi Sport (Đồng Phục Univi)

**Bio:**
> Dược sĩ, tốt nghiệp Đại học Dược Hà Nội năm 2016, từng làm trình dược viên cho các hãng dược phẩm Mỹ và Thụy Sĩ. Đồng sáng lập Univi Sport — đơn vị sản xuất đồng phục thể thao (Gym, Yoga, Pilates, Pickleball) và đồng phục doanh nghiệp tại Hà Nội. Hiền chọn và thử vải theo cách tư duy của một dược sĩ: xét từ thành phần, hiểu bản chất, rồi mới kết luận có phù hợp với người mặc hay không.

## Đối chiếu với bản đề xuất bên ngoài

| Nội dung bản ngoài | Nguồn trên site | Xử lý |
|---|---|---|
| Tốt nghiệp ĐH Dược Hà Nội 2016 | Bài sáng lập, dòng 15 | Giữ |
| "Làm việc tại các tập đoàn dược phẩm Mỹ và Thụy Sĩ" | Bài ghi **"trình dược viên tại các hãng dược phẩm"** | Giữ, ghi đúng vai trò |
| Chức danh "Co-Founder & Giám đốc Phát triển Sản phẩm" | Không có nguồn. Bài ghi "Đồng Sáng Lập"; `lib/companyInfo.ts` ghi "Đồng sáng lập & CEO"; DB ghi "Founder Univi Sport" | **Cần Univi chốt 1 chức danh** |
| "Trực tiếp phụ trách nghiên cứu chất liệu và QC" | Không có nguồn | Bỏ, trừ khi Univi xác nhận |
| "Người thúc đẩy đưa vải đi kiểm định tại Viện…" | Bài có nói vải được kiểm định độc lập, nhưng không gán việc này cho Hiền và không nêu tên Viện | Bỏ khỏi bio |
| "An toàn sinh học", "Super Cool, Quick Dry" | Không có trong bài sáng lập | Bỏ |
| Xưởng tại Đan Phượng (mục 2 của bản ngoài) | Bài sáng lập **hiện ghi Chương Mỹ**, khớp `companyInfo` | Không cần sửa bài; mục "Địa chỉ xưởng" trong `docs/knowledge/27-can-xac-minh.md` vẫn chưa chốt |
| `reviewedBy` = "Bộ phận QC" trên BlogPosting | `reviewedBy` là thuộc tính của WebPage, không phải Article; bộ phận QC chưa được xác nhận | Không triển khai |
| Script phân bổ lại `published_at` cho 92 bài | DB có `createdAt` riêng cho cả 94 bài, rải theo nhiều ngày | Không cần chạy. Chạy sẽ thành bịa ngày đăng |

## Email
Bài sáng lập đang công khai `tranhiensunnytran@gmail.com`. Nếu tạo email tên miền (vd. `hien.tran@dongphucunivi.com`), cần sửa trong nội dung bài. Đây không phải trường của model Author.
