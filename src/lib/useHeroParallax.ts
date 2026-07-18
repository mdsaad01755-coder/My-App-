"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAnimationTier, watchAnimationTier } from "@/lib/performance";

gsap.registerPlugin(ScrollTrigger);

interface HeroParallaxRefs {
  section: RefObject<HTMLElement | null>;
  blobA: RefObject<HTMLDivElement | null>;
  blobB: RefObject<HTMLDivElement | null>;
  content: RefObject<HTMLDivElement | null>;
  portrait?: RefObject<HTMLDivElement | null>;
}

/**
 * Subtle Apple-style scroll parallax for the Hero section:
 *  - background blobs drift slower than scroll (depth)
 *  - headline/content fades and scales down slightly as it leaves view
 *  - the floating portrait drifts opposite the content, with a faint
 *    rotation and scale-down, for a sense of depth as you scroll past
 *
 * Fully skipped under prefers-reduced-motion, and simplified (content
 * fade only, no blob/portrait parallax) on low-powered devices to keep
 * scroll buttery on weak hardware.
 */
export function useHeroParallax({
  section,
  blobA,
  blobB,
  content,
  portrait,
}: HeroParallaxRefs) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;

    function build() {
      const tier = getAnimationTier();
      if (!section.current) return;

      // Reduced motion: no scroll-linked animation at all.
      if (tier === "off") return;

      ctx = gsap.context(() => {
        const scrollTriggerBase = {
          trigger: section.current as HTMLElement,
          start: "top top",
          end: "bottom top",
          scrub: true,
        };

        // Content: gentle fade + scale as the hero scrolls out of view.
        if (content.current) {
          gsap.to(content.current, {
            opacity: 0.15,
            scale: 0.94,
            y: -40,
            ease: "none",
            scrollTrigger: scrollTriggerBase,
          });
        }

        // Blob parallax + portrait scroll motion: only on full-tier
        // devices — these are the most expensive part (continuously
        // transformed large layers), so low-tier devices skip them.
        if (tier === "full") {
          if (blobA.current) {
            gsap.to(blobA.current, {
              yPercent: 18,
              ease: "none",
              scrollTrigger: scrollTriggerBase,
            });
          }
          if (blobB.current) {
            gsap.to(blobB.current, {
              yPercent: -14,
              ease: "none",
              scrollTrigger: scrollTriggerBase,
            });
          }
          if (portrait?.current) {
            gsap.to(portrait.current, {
              yPercent: -10,
              rotate: -3,
              scale: 0.92,
              ease: "none",
              scrollTrigger: scrollTriggerBase,
            });
          }
        }
      }, section);

      // Ensure trigger start/end values reflect the final layout
      // (fonts, images, and Lenis's wrapper can all shift measurements
      // slightly after first paint).
      ScrollTrigger.refresh();
    }

    build();

    const unwatch = watchAnimationTier(() => {
      ctx?.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      build();
    });

    return () => {
      unwatch();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
