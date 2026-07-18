"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/performance";

const HOLD_SECONDS = 1.2; // time the portrait stays fully visible before exit

/**
 * Full-screen intro preloader: fades/scales a portrait image in, holds it
 * briefly, then scales it up while cross-fading the whole black overlay
 * out to reveal the Hero underneath. Fully unmounts after the sequence so
 * it costs nothing once it's done.
 *
 * Respects prefers-reduced-motion: skips straight to a quick, simple
 * fade rather than the full scale choreography.
 */
export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Prevent scrolling (and Lenis-driven scroll) while the intro plays.
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    // Preloader is a decorative intro flourish, not essential content —
    // if the user prefers reduced motion, skip the choreography and
    // remove it almost immediately instead of holding the page hostage.
    if (prefersReducedMotion()) {
      const t = setTimeout(() => setMounted(false), 150);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      if (!overlayRef.current || !imageRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => setMounted(false),
      });

      // 1. Fade + scale in: small -> normal size, opacity 0 -> 1
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }
      )
        // 2. Hold on screen briefly
        .to({}, { duration: HOLD_SECONDS })
        // 3. Exit: image scales up further while fading out
        .to(imageRef.current, {
          scale: 1.4,
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        // 4. Overlay cross-fades out at the same time as the image exit
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "<" // start at the same time as the previous tween
        );
    });

    return () => ctx.revert();
  }, []);

  if (!mounted) return null;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      role="presentation"
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 
          plain <img> is intentional here: this is a static export
          (output: 'export') with images.unoptimized: true, so next/image
          buys nothing at build time and this keeps the preloader free of
          any image-loader indirection during the very first paint. */}
      <img
        ref={imageRef}
        src={`${basePath}/preloader.png`}
        alt=""
        className="h-[42vh] w-auto max-w-[70vw] object-contain opacity-0 sm:h-[50vh] sm:max-w-[60vw] md:h-[56vh]"
        draggable={false}
      />
    </div>
  );
}
