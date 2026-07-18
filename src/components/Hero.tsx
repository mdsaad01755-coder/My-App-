"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { useHeroParallax } from "@/lib/useHeroParallax";

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

  useHeroParallax({
    section: sectionRef,
    blobA: blobARef,
    blobB: blobBRef,
    content: contentRef,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-base px-6"
    >
      {/* Signature: drifting aurora blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          ref={blobARef}
          className="aurora-blob-a absolute left-1/2 top-1/3 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] sm:h-[46rem] sm:w-[46rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,92,255,0.55) 0%, rgba(124,92,255,0) 70%)",
          }}
        />
        <div
          ref={blobBRef}
          className="aurora-blob-b absolute left-1/2 top-2/3 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] sm:h-[38rem] sm:w-[38rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(62,142,255,0.45) 0%, rgba(62,142,255,0) 70%)",
          }}
        />
        {/* Grain texture for tactile depth */}
        <div className="grain-overlay absolute inset-0" />
        {/* Vignette to keep edges dark and focus centered */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, #05060a 90%)",
          }}
        />
      </div>

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-blue" />
          Now in early access
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.1}
          variants={fadeUp}
          className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight text-text sm:text-6xl md:text-7xl"
        >
          Your SaaS Product Name,
          <br />
          <span className="bg-gradient-to-r from-violet via-violet to-blue bg-clip-text text-transparent">
            built for momentum.
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={0.22}
          variants={fadeUp}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
        >
          Ship faster, automate the busywork, and give your team one place to
          plan, build, and launch — without the operational drag.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.34}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet to-blue px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_0_rgba(124,92,255,0.5)] transition-shadow duration-300 hover:shadow-[0_0_40px_4px_rgba(124,92,255,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet">
            Try Free
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-text transition-colors duration-300 hover:border-violet/60 hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet">
            Get Started
          </button>
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

/**
 * Temporary placeholder so the page has scrollable height beyond one
 * viewport, letting the Hero's scroll-linked parallax actually trigger.
 * This will be replaced by the real Features section in the next step.
 */
export function ScrollPlaceholder() {
  return (
    <section className="relative flex min-h-[100svh] w-full items-center justify-center bg-panel px-6">
      <p className="text-sm text-muted">
        Features section coming in the next step →
      </p>
    </section>
  );
}
