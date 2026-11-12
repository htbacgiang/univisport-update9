import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { DEFAULT_HOMEPAGE_FAQS } from "../data/homepageFaqs.js";
import HomepageFaqSettings from "../models/HomepageFaqSettings.js";

// Đọc MONGODB_URI từ .env nếu chưa có trong process.env
if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/MONGODB_URI\s*=\s*(.+)/);
      if (match) {
        process.env.MONGODB_URI = match[1].trim();
      }
    }
  } catch (err) {
    console.warn("Không đọc được file .env:", err.message);
  }
}

async function syncHomepageFaqs() {
  if (!process.env.MONGODB_URI) {
    console.error("Lỗi: Không tìm thấy biến môi trường MONGODB_URI.");
    process.exit(1);
  }

  console.log("Đang kết nối MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Đã kết nối MongoDB thành công.");

  console.log(`Đang đồng bộ ${DEFAULT_HOMEPAGE_FAQS.length} câu FAQ trang chủ kèm video vào collection homepagefaqsettings...`);

  const updated = await HomepageFaqSettings.findOneAndUpdate(
    { key: "homepage" },
    {
      $set: {
        key: "homepage",
        faqs: DEFAULT_HOMEPAGE_FAQS,
      },
    },
    { new: true, upsert: true }
  );

  console.log("Đồng bộ thành công! Số câu FAQ hiện tại trong DB:", updated.faqs.length);
  updated.faqs.forEach((f, idx) => {
    console.log(`[${idx + 1}] ${f.question}`);
    console.log(`    Video: ${f.video || "(không có)"}`);
  });

  await mongoose.disconnect();
  console.log("Đã ngắt kết nối database.");
}

syncHomepageFaqs().catch((error) => {
  console.error("Lỗi khi đồng bộ FAQ:", error);
  process.exit(1);
});

