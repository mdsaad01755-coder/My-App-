"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import gsap from "gsap";
import { useHeroParallax } from "@/lib/useHeroParallax";
import HeroPortrait from "@/components/HeroPortrait";
import MagneticButton from "@/components/MagneticButton";
import { prefersReducedMotion } from "@/lib/performance";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useHeroParallax({
    section: sectionRef,
    blobA: blobARef,
    blobB: blobBRef,
    content: contentRef,
    portrait: portraitRef,
  });

  // Headline lines stagger in from below, 0.1s apart — GSAP rather than
  // Framer Motion here since we want fine-grained per-line stagger
  // control that reads cleanly as a single timeline.
  useEffect(() => {
    if (!headlineRef.current) return;

    const lines = headlineRef.current.querySelectorAll<HTMLElement>(
      "[data-headline-line]"
    );
    if (!lines.length) return;

    // Reduced motion: skip the staggered choreography, but the lines
    // must still end up visible — just snap them straight to their
    // final state instead of animating.
    if (prefersReducedMotion()) {
      gsap.set(lines, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.55, // sits after the eyebrow badge's own entrance
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, headlineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-base px-6 py-24"
    >
      {/* Signature: drifting aurora blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          ref={blobARef}
          className="aurora-blob-a absolute left-1/2 top-1/3 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:radial-gradient(circle,rgba(124,92,255,0.55)_0%,rgba(124,92,255,0)_70%)] blur-[120px] sm:h-[46rem] sm:w-[46rem]"
        />
        <div
          ref={blobBRef}
          className="aurora-blob-b absolute left-1/2 top-2/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:radial-gradient(circle,rgba(62,142,255,0.45)_0%,rgba(62,142,255,0)_70%)] blur-[110px] sm:h-[38rem] sm:w-[38rem]"
        />
        {/* Ambient mesh gradient — very slow drift, reads as texture */}
        <div className="mesh-gradient absolute inset-0" />
        {/* Grain texture for tactile depth */}
        <div className="grain-overlay absolute inset-0" />
        {/* Vignette to keep edges dark and focus centered */}
        <div className="absolute inset-0 bg-[image:radial-gradient(ellipse_at_center,transparent_35%,#08080c_90%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Hero content */}
        <div
          ref={contentRef}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.span
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="glass-surface mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-blue" />
            Now in early access
          </motion.span>

          <h1
            ref={headlineRef}
            className="font-heading text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.01em] text-text sm:text-6xl md:text-7xl"
          >
            <span data-headline-line className="block opacity-0">
              Your SaaS Product Name,
            </span>
            <span
              data-headline-line
              className="block bg-gradient-to-r from-silver via-violet to-blue bg-clip-text text-transparent opacity-0"
            >
              built for momentum.
            </span>
          </h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.22}
            variants={fadeUp}
            className="mt-7 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
          >
            Ship faster, automate the busywork, and give your team one place
            to plan, build, and launch — without the operational drag.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={0.34}
            variants={fadeUp}
            className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
          >
            <MagneticButton
              variant="primary"
              className="shadow-[0_0_0_0_rgba(124,92,255,0.5)] hover:shadow-[0_0_40px_4px_rgba(124,92,255,0.45)]"
            >
              Try Free
            </MagneticButton>
            <MagneticButton variant="secondary">Get Started</MagneticButton>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={0.44}
            variants={fadeUp}
            className="mt-6 text-xs text-muted"
          >
            No credit card required · Free 14-day trial
          </motion.p>
        </div>

        {/* Floating 3D portrait */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Separate inner node for GSAP's scroll-linked parallax, so
              it never fights Framer Motion's transform on the outer
              entrance wrapper above. */}
          <div ref={portraitRef}>
            <HeroPortrait />
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border border-border p-1.5"
          aria-hidden="true"
        >
          <span className="h-1.5 w-1 rounded-full bg-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
