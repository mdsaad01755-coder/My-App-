"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/performance";

const HOLD_SECONDS = 1.1; // time the portrait stays fully visible before exit

/**
 * Full-screen intro preloader: fades/scales a portrait image in with a
 * cinematic blur-to-sharp reveal, holds it briefly while a thin progress
 * line fills, then scales it up while cross-fading the whole black overlay
 * out to reveal the Hero underneath. Fully unmounts after the sequence so
 * it costs nothing once it's done.
 *
 * Respects prefers-reduced-motion: skips straight to a quick, simple
 * fade rather than the full choreography.
 */
export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [percent, setPercent] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef({ value: 0 });

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

      // 1. Fade + scale in, with a blur-to-sharp cinematic reveal.
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.85, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power2.out",
        }
      )
        // Ambient glow behind the portrait breathes in alongside it.
        .fromTo(
          glowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.1, ease: "power1.out" },
          "<"
        )
        // 2. Hold on screen while the progress line fills 0 -> 100%.
        .to(
          progressBarRef.current,
          { scaleX: 1, duration: HOLD_SECONDS, ease: "power1.inOut" },
          "<0.1"
        )
        .to(
          counterRef.current,
          {
            value: 100,
            duration: HOLD_SECONDS,
            ease: "power1.inOut",
            onUpdate: () =>
              setPercent(Math.round(counterRef.current.value)),
          },
          "<"
        )
        // 3. Exit: image scales up further while fading out, expo easing
        //    for a smooth, weighty cinematic finish (with a touch of
        //    directional blur to sell the motion).
        .to(imageRef.current, {
          scale: 1.4,
          opacity: 0,
          filter: "blur(6px)",
          duration: 1,
          ease: "expo.inOut",
        })
        // Progress UI fades out quickly as the exit begins.
        .to(
          [progressBarRef.current?.parentElement, glowRef.current],
          { opacity: 0, duration: 0.4, ease: "power1.out" },
          "<"
        )
        // 4. Overlay cross-fades out at the same time as the image exit.
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 1,
            ease: "expo.inOut",
          },
          "<"
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
      {/* Vignette so the edges stay pure black and focus pulls to center */}
      <div className="pointer-events-none absolute inset-0 bg-[image:radial-gradient(ellipse_at_center,transparent_40%,#000000_92%)]" />

      <div className="relative flex flex-col items-center">
        {/* Soft ambient glow behind the portrait */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:radial-gradient(circle,rgba(124,92,255,0.35)_0%,rgba(62,142,255,0.15)_45%,transparent_75%)] opacity-0 blur-[80px]"
        />

        {/* eslint-disable-next-line @next/next/no-img-element -- 
            plain <img> is intentional here: this is a static export
            (output: 'export') with images.unoptimized: true, so next/image
            buys nothing at build time and this keeps the preloader free of
            any image-loader indirection during the very first paint. */}
        <img
          ref={imageRef}
          src={`${basePath}/preloader.png`}
          alt=""
          loading="eager"
          fetchPriority="high"
          className="relative h-[42vh] w-auto max-w-[70vw] object-contain opacity-0 sm:h-[50vh] sm:max-w-[60vw] md:h-[56vh]"
          draggable={false}
        />

        {/* Elegant loading progress indicator */}
        <div className="relative mt-8 flex w-40 flex-col items-center gap-3 sm:w-48">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <div
              ref={progressBarRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-blue"
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-white/50">
            {String(percent).padStart(3, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
