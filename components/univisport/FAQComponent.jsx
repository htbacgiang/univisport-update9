"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  DEFAULT_HOMEPAGE_FAQS,
  DEFAULT_CLOUDINARY_VIDEO,
} from "../../data/homepageFaqs";

const isFacebookVideo = (url) =>
  typeof url === "string" &&
  (url.includes("facebook.com") || url.includes("fb.watch"));

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const FAQComponent = ({ items }) => {
  const [expanded, setExpanded] = useState(0); // Mặc định mở câu 1
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Bắt đầu muted để autoplay 100% được trình duyệt duyệt
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const isUserPausedRef = useRef(false);

  // Lấy dữ liệu câu hỏi và video trực tiếp từ data/homepageFaqs.js
  const faqs = useMemo(
    () =>
      (DEFAULT_HOMEPAGE_FAQS || [])
        .filter((faq) => faq?.question && faq?.answer)
        .map((faq, index) => {
          const rawVideo = typeof faq.video === "string" ? faq.video.trim() : "";
          const video = rawVideo || DEFAULT_CLOUDINARY_VIDEO;

          return {
            ...faq,
            _id: faq._id || `faq-${index}`,
            image: faq.image || "/images/thumb-univi.jpg",
            video,
          };
        }),
    []
  );

  const currentFaq = faqs[selectedMedia] || faqs[0];
  const activeVideo = currentFaq?.video || DEFAULT_CLOUDINARY_VIDEO;

  // Click vào câu hỏi FAQ ở danh sách bên trái: đổi câu hỏi và phát video tương ứng ngay lập tức
  const toggleFAQ = (index) => {
    isUserPausedRef.current = false;
    setExpanded((current) => (current === index ? null : index));
    setSelectedMedia(index);
  };

  // Tự động phát khi đổi câu hỏi (selectedMedia thay đổi)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isFacebookVideo(activeVideo)) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Trình duyệt chặn autoplay có tiếng -> mute và phát tiếp
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        });
    }
  }, [selectedMedia, activeVideo]);

  // Tự động dừng video khi cuộn ra khỏi khu vực FAQ (và phát tiếp khi cuộn vào lại)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.05;
        const video = videoRef.current;

        if (!isVisible) {
          // Cuộn ra khỏi khu vực FAQ -> Tự động dừng video
          if (video && !video.paused) {
            video.pause();
            setIsPlaying(false);
          }
          // Dừng các video khác trong section (ví dụ video mobile)
          const allVideos = section.querySelectorAll("video");
          allVideos.forEach((v) => {
            if (!v.paused) v.pause();
          });
        } else {
          // Cuộn lại vào khu vực FAQ -> Nếu người dùng chưa chủ động bấm dừng thì tiếp tục phát
          if (video && !isUserPausedRef.current && !isFacebookVideo(activeVideo)) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                video.muted = true;
                setIsMuted(true);
                video.play().then(() => setIsPlaying(true)).catch(() => {});
              });
          }
        }
      },
      { threshold: [0, 0.05, 0.15] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [activeVideo]);

  // Click vào màn hình video (Desktop): Play / Pause
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      isUserPausedRef.current = false;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    } else {
      isUserPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    }
  };

  // Bật/tắt tiếng
  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  // Tua video khi click thanh tiến trình
  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    video.currentTime = ratio * video.duration;
    setProgress(ratio * 100);
  };

  // Cập nhật tiến trình video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [selectedMedia]);

  if (!currentFaq) return null;

  return (
    <section
      ref={sectionRef}
      className="faq-section py-16 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 gradient-faq-bg-decoration rounded-full blur-3xl translate-x-48 translate-y-48 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="md:text-2xl text-xl font-medium tracking-tight leading-6 uppercase md:mb-4 mb-2 gradient-faq-title mx-auto">
            Câu Hỏi Thường Gặp Về Univi
          </h2>
          <div className="w-16 h-1 gradient-faq-divider mx-auto md:mb-4 mb-2 rounded-full" />
          <p className="text-lg text-slate-600/90 max-w-4xl mx-auto">
            Tìm hiểu các thông tin về sản phẩm và dịch vụ đồng phục thể thao chuyên nghiệp của Đồng Phục Univi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* FAQ List */}
          <div className="space-y-3 lg:col-span-2">
            {faqs.map((faq, index) => {
              const isSelected = selectedMedia === index;
              const isItemExpanded = expanded === index;

              return (
                <div
                  key={faq._id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? "gradient-faq-selected ring-2 ring-blue-200 shadow-lg"
                      : "bg-white/80 backdrop-blur-sm ring-1 ring-white/40 shadow-md hover:shadow-lg"
                  }`}
                >
                  <button
                    className="w-full p-4 lg:p-5 text-left transition-all duration-300 hover:bg-white/50"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isItemExpanded}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium text-sm lg:text-base transition-colors duration-300 ${
                          isSelected ? "text-[#105d97]" : "text-slate-700"
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 lg:w-5 lg:h-5 transition-all duration-300 flex-shrink-0 ml-2 ${
                          isItemExpanded ? "rotate-180" : ""
                        } ${isSelected ? "text-[#105d97]" : "text-slate-400"}`}
                      />
                    </div>
                  </button>

                  {/* Nội dung câu trả lời + Video phát trực tiếp trên Mobile */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isItemExpanded
                        ? "max-h-[800px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 lg:px-5 pb-4 lg:pb-5">
                      <div className="border-t border-slate-200/50 pt-3 lg:pt-4">
                        <div className="text-slate-600 text-sm lg:text-base leading-6">
                          {(faq?.answer || "").split("\n").map((line, lineIndex) => (
                            <p key={lineIndex} className="mb-1 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>

                        {/* Video phát trực tiếp trên Mobile (Không dùng ảnh xem trước) */}
                        {isItemExpanded && faq.video && (
                          <div className="lg:hidden mt-4 pt-3 border-t border-slate-100">
                            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16] max-w-[270px] mx-auto bg-slate-900">
                              {isFacebookVideo(faq.video) ? (
                                <iframe
                                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                                    faq.video
                                  )}&show_text=false&autoplay=true&muted=true&playsinline=true&controls=true&width=270&height=480`}
                                  width="100%"
                                  height="100%"
                                  style={{ border: "none", overflow: "hidden" }}
                                  scrolling="no"
                                  frameBorder="0"
                                  loading="lazy"
                                  allowFullScreen={true}
                                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                  className="w-full h-full rounded-2xl"
                                />
                              ) : (
                                <video
                                  src={faq.video}
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  controls
                                  preload="auto"
                                  className="w-full h-full object-cover rounded-2xl"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Media Section - Desktop Sticky (Video phát trực tiếp, KHÔNG dùng ảnh xem trước) */}
          <div className="relative w-full hidden lg:flex lg:flex-col lg:items-center lg:col-span-1 lg:sticky lg:top-24">
            <div className="w-[290px] xl:w-[330px] max-w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] w-full bg-slate-900 group">
                {isFacebookVideo(activeVideo) ? (
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                      activeVideo
                    )}&show_text=false&autoplay=true&muted=${isMuted}&playsinline=true&controls=true&width=330&height=586`}
                    width="100%"
                    height="100%"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; microphone; camera; fullscreen"
                    className="w-full h-full rounded-2xl"
                    key={`desktop-fb-${selectedMedia}-${isMuted}`}
                  />
                ) : (
                  /* Thẻ Video HTML5 (Cloudinary / MP4) - Hiển thị và phát trực tiếp */
                  <div
                    className="relative w-full h-full cursor-pointer select-none"
                    onClick={handleVideoClick}
                  >
                    <video
                      ref={videoRef}
                      src={activeVideo}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-2xl"
                    />

                    {/* Nút Play to ở giữa khi đang tạm dừng */}
                    {!isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-200">
                        <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-blue-600 transition-transform">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Header điều khiển: Trạng thái & Nút Bật/Tắt âm */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isPlaying
                              ? "bg-green-400 animate-pulse"
                              : "bg-amber-400"
                          }`}
                        />
                        {isPlaying ? "Đang phát video" : "Tạm dừng"}
                      </span>

                      <button
                        type="button"
                        onClick={toggleMute}
                        aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                        className="pointer-events-auto w-8 h-8 rounded-full bg-black/65 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>

                    {/* Footer điều khiển & tiến trình */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Tiêu đề câu hỏi đang phát */}
                      <p className="text-white text-xs font-medium line-clamp-1 mb-2 opacity-95">
                        {currentFaq.question}
                      </p>

                      {/* Thanh tiến trình có thể click để tua */}
                      <div
                        className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden mb-2 cursor-pointer"
                        onClick={handleSeek}
                        title="Click để tua video"
                      >
                        <div
                          className="bg-blue-500 h-full transition-all duration-100 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-white text-[11px]">
                        <button
                          type="button"
                          onClick={handleVideoClick}
                          className="flex items-center gap-1.5 font-medium hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-white text-white" />
                              <span>Tạm dừng</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                              <span>Phát tiếp</span>
                            </>
                          )}
                        </button>
                        <span className="tabular-nums font-mono opacity-80 text-[10px]">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Link Facebook nếu là video Facebook */}
              {isFacebookVideo(activeVideo) && (
                <div className="mt-3">
                  <a
                    href={activeVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 w-full justify-center gradient-faq-button text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium text-sm xl:text-base"
                  >
                    <span>Xem trên Facebook</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQComponent;
