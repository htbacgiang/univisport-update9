// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi-VN">
      <Head>
        <meta name="google-site-verification" content="kNL7mAgNeJ_YF0n5xp1aWaEILSmJvt4hFsNJPOpMujY" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="p:domain_verify" content="46fb224c998b15a6ef1c551d52257138" />
        {/* Không preload font thủ công ở đây:
            - Gilroy: next/font (pages/_app.js) tự preload bản WOFF2 đã hash.
            - Anton / STIX: chỉ dùng ở /bo-suu-tap, /gioi-thieu → tải theo nhu cầu.
            Trước đây preload 4 file OTF/TTF (~1,1MB tính cả bản trùng của next/font) ở MỌI trang. */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
