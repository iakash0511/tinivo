"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

type OrderPackingSectionProps = {
  videoMp4Url: string
  videoWebmUrl: string
  posterUrl: string
}


export default function OrderPackingSection({
  videoMp4Url,
  videoWebmUrl,
  posterUrl,
}: OrderPackingSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          window.gtag?.('event', 'view_packing_section', {
            event_category: 'trust',
            event_label: 'order_packing_section',
            })
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="order-packing" 
      className="mt-8 rounded-2xl bg-neutral-light/60 p-4 md:p-5"
    >
      {/* Title */}
      <h3 className="font-heading text-base md:text-lg text-neutral-dark text-center font-medium">
        How your Tinivo order reaches you 💜
      </h3>

      {/* Video */}
      <div className="relative mt-3 overflow-hidden rounded-xl bg-softPink aspect-4/5 md:aspect-video">
        {!isPlaying ? (
          <button
            type="button"
            onClick={() => {
                setIsPlaying(true)

                window.gtag?.('event', 'play_packing_video', {
                    event_category: 'trust',
                    event_label: 'order_packing_video',
                })
            }}
            className="group relative h-full w-full"
            aria-label="Play packing video"
            disabled={!isVisible}
          >
            <Image
              src={posterUrl}
              alt="Tinivo order packing preview"
              fill
              sizes="(max-width: 768px) 90vw, 720px"
              loading="lazy"
              className="object-cover"
            />

            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-md transition-transform active:scale-95 group-hover:scale-105">
                <Play className="h-6 w-6 text-white" />
              </span>
            </span>
          </button>
        ) : (
          isVisible && (
            <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            muted
            playsInline
            preload="metadata"
            poster={posterUrl}
            >
            <source src={videoMp4Url} type="video/mp4" />
            <source src={videoWebmUrl} type="video/webm" />
            </video>
          )
        )}
      </div>

      {/* Copy */}
      <p className="mt-4 text-sm font-body text-neutral-dark/80">
        Every Tinivo order is packed by hand with care, logo stickers, and a
        thank-you note ✨
      </p>

      {/* Trust row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-body text-neutral-dark/70">
        <span>🎁 Gift-ready</span>
        <span>🚚 Tracked delivery</span>
        <span>🔒 Secure prepaid</span>
      </div>
    </section>
  );
}
