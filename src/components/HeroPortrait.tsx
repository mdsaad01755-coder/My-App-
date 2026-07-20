"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getAnimationTier, watchAnimationTier } from "@/lib/performance";

/**
 * Premium floating portrait for the Hero section.
 *
 * Effects (all CSS transform + GSAP, no Three.js — kept deliberately
 * lightweight so it stays smooth on low-end hardware):
 *  - Continuous slow float (x/y drift + slight rotation) via GSAP
 *  - 3D depth: perspective + rotateX/rotateY/translateZ tilt that follows
 *    the cursor, with elastic return to neutral on mouse leave
 *  - Dynamic shadow: grows/blurs based on how "lifted" the card currently is
 *  - Hover: slight zoom-in + stronger glow
 *  - A soft diagonal light sweep animates across the glass edge
 *
 * Degrades by tier:
 *  - "off"  (reduced motion): fully static, no listeners attached
 *  - "low"  (weak CPU / slow network): keep the entrance + a very slow,
 *    cheap float; skip mouse-tilt and the light sweep entirely
 *  - "full": everything enabled
 */
export default function HeroPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null); // perspective container
  const cardRef = useRef<HTMLDivElement>(null); // tilts on mouse move
  const imgRef = useRef<HTMLDivElement>(null); // floats continuously
  const shadowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let floatTween: gsap.core.Tween | undefined;
    let sweepTween: gsap.core.Tween | undefined;
    let quickX: ((v: number) => void) | undefined;
    let quickY: ((v: number) => void) | undefined;
    let quickShadowX: ((v: number) => void) | undefined;

    function handlePointerMove(e: PointerEvent) {
      const el = wrapRef.current;
      if (!el || !quickX || !quickY) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;

      const maxTilt = 10; // degrees — subtle, not gimmicky
      quickY(px * maxTilt); // horizontal position -> rotateY
      quickX(-py * maxTilt); // vertical position -> rotateX
      quickShadowX?.(px * 24);
    }

    function handlePointerLeave() {
      quickX?.(0);
      quickY?.(0);
      quickShadowX?.(0);
    }

    function build() {
      const tier = getAnimationTier();
      const wrap = wrapRef.current;
      const card = cardRef.current;
      const img = imgRef.current;
      const shadow = shadowRef.current;
      const sweep = sweepRef.current;
      if (!wrap || !card || !img) return;

      // Reduced motion: static, no listeners, no tweens.
      if (tier === "off") return;

      quickX = gsap.quickTo(card, "rotateX", {
        duration: 0.6,
        ease: "power3.out",
      });
      quickY = gsap.quickTo(card, "rotateY", {
        duration: 0.6,
        ease: "power3.out",
      });
      if (shadow) {
        quickShadowX = gsap.quickTo(shadow, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
      }

      // Gentle continuous float — up/down/left/right drift. Runs on every
      // tier except "off": it's cheap (a single transform tween).
      floatTween = gsap.to(img, {
        y: tier === "low" ? -10 : -16,
        x: tier === "low" ? 4 : 8,
        rotate: tier === "low" ? 0.6 : 1.2,
        duration: tier === "low" ? 5 : 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Mouse-follow tilt + light sweep: full tier only, this is the
      // part that costs the most (pointer listener + extra tween).
      if (tier === "full") {
        wrap.addEventListener("pointermove", handlePointerMove);
        wrap.addEventListener("pointerleave", handlePointerLeave);

        if (sweep) {
          sweepTween = gsap.fromTo(
            sweep,
            { xPercent: -130 },
            {
              xPercent: 130,
              duration: 3.2,
              ease: "power1.inOut",
              repeat: -1,
              repeatDelay: 1.8,
            }
          );
        }
      }
    }

    function teardown() {
      wrapRef.current?.removeEventListener("pointermove", handlePointerMove);
      wrapRef.current?.removeEventListener("pointerleave", handlePointerLeave);
      floatTween?.kill();
      sweepTween?.kill();
      gsap.set([cardRef.current, shadowRef.current].filter(Boolean), {
        clearProps: "all",
      });
    }

    build();
    const unwatch = watchAnimationTier(() => {
      teardown();
      build();
    });

    return () => {
      unwatch();
      teardown();
    };
  }, []);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[280px] pb-8 [perspective:1200px] sm:max-w-[320px] md:max-w-[380px]"
    >
      {/* Dynamic drop shadow: separate layer so it can move/blur
          independently of the card's own transform. */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="absolute inset-x-6 bottom-2 h-10 rounded-full bg-black/60 blur-[40px]"
      />

      <div
        ref={imgRef}
        className="group relative will-change-transform [transform-style:preserve-3d]"
      >
        {/* Glassmorphism outer frame: sits outside the image's own
            rounded edge, never overlapping the face/subject — just a
            thin glass ring that makes the card feel "set" into the
            page rather than pasted on top of it. */}
        <div
          aria-hidden="true"
          className="glass-surface pointer-events-none absolute -inset-3 -z-[1] rounded-[2.25rem]"
        />

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[1.75rem] border border-silver/15 shadow-[0_30px_80px_-20px_rgba(124,92,255,0.35)] transition-shadow duration-500 [transform-style:preserve-3d] [will-change:transform] group-hover:shadow-[0_40px_100px_-16px_rgba(124,92,255,0.55)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element --
              static export (images.unoptimized: true); next/image adds
              no build-time benefit here and this keeps the tilt/float
              transform chain simple with a single DOM node to animate. */}
          <img
            src={`${basePath}/preloader.png`}
            alt="Product founder portrait"
            loading="eager"
            className="aspect-[3/4] w-full origin-center object-cover object-top transition-transform duration-700 ease-out [transform:translateZ(20px)_scale(1.02)] group-hover:[transform:translateZ(20px)_scale(1.08)]"
            draggable={false}
          />

          {/* Subtle glass edge highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10"
          />

          {/* Cinematic diagonal light sweep (full tier only) */}
          <div
            ref={sweepRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70"
          />

          {/* Bottom gradient for grounding + text legibility if needed later */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent"
          />
        </div>

        {/* Caption card: name + role, floating over the bottom-left of
            the frame in its own glass surface — offset outside the
            image bounds so it never covers the subject's face. */}
        <div className="glass-surface absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 sm:-left-5 sm:translate-x-0">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-blue text-[11px] font-semibold text-white">
            AR
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-text">
              Alex Rivera
            </span>
            <span className="text-[11px] text-muted">Founder &amp; CEO</span>
          </span>
        </div>

        {/* Ambient accent glow behind the card — brighter and wider than
            before so the portrait reads as "floating in light". */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-violet/40 via-blue/25 to-silver/10 opacity-70 blur-[50px]"
        />
        <div
          aria-hidden="true"
          className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-blue/25 via-transparent to-violet/25 opacity-60 blur-2xl"
        />
      </div>
    </div>
  );
}
