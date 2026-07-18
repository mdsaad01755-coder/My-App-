"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAnimationTier, watchAnimationTier } from "@/lib/performance";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps the app in Lenis smooth scrolling, kept in sync with GSAP's
 * ScrollTrigger so scroll-linked animations (parallax, fades) track the
 * smoothed scroll position rather than the raw native one.
 *
 * Skips entirely when the user prefers reduced motion, or degrades to a
 * lighter config on weak devices, so scrolling never fights the browser's
 * native behavior on hardware that can't keep up.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let rafId: number;

    function setup() {
      const tier = getAnimationTier();

      // Respect reduced motion: don't hijack scroll behavior at all.
      if (tier === "off") {
        lenisRef.current?.destroy();
        lenisRef.current = null;
        return;
      }

      if (lenisRef.current) return; // already running

      const lenis = new Lenis({
        duration: tier === "low" ? 0.9 : 1.2,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        // Lighter touch on constrained devices: less lag between input and motion.
        wheelMultiplier: tier === "low" ? 1.1 : 1,
      });
      lenisRef.current = lenis;

      // Keep ScrollTrigger's internal scroll position in sync with Lenis.
      lenis.on("scroll", ScrollTrigger.update);

      // GSAP's own rAF ticker would otherwise fight with Lenis's — let
      // Lenis drive the frame loop exclusively, and disable GSAP's lag
      // smoothing so scrub animations don't jitter/catch-up oddly.
      gsap.ticker.lagSmoothing(0);

      function raf(time: number) {
        lenisRef.current?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // ScrollTriggers created before Lenis finished setting up its
      // wrapper can end up with stale start/end measurements. Recalculate
      // once Lenis is live so parallax offsets line up correctly.
      ScrollTrigger.refresh();
    }

    setup();
    const unwatch = watchAnimationTier(() => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setup();
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      unwatch();
    };
  }, []);

  return <>{children}</>;
}
