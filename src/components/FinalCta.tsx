"use client";

import { motion, type Variants } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function FinalCta() {
  return (
    <section className="relative w-full overflow-hidden bg-base px-6 py-24 sm:py-32">
      {/* Ambient glow, echoing the Hero's aurora background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:radial-gradient(circle,rgba(124,92,255,0.35)_0%,rgba(62,142,255,0.15)_45%,transparent_75%)] blur-[120px]" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        custom={0}
        variants={fadeUp}
        className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-blue" />
          Ready when you are
        </span>

        <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-text sm:text-5xl md:text-6xl">
          Start shipping{" "}
          <span className="bg-gradient-to-r from-violet via-violet to-blue bg-clip-text text-transparent">
            faster today.
          </span>
        </h2>

        <p className="mt-6 max-w-lg text-balance text-base leading-relaxed text-muted sm:text-lg">
          Join thousands of teams who&apos;ve traded tool-hopping for one
          fast, focused workspace.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <MagneticButton
            variant="primary"
            className="shadow-[0_0_0_0_rgba(124,92,255,0.5)] hover:shadow-[0_0_40px_4px_rgba(124,92,255,0.45)]"
          >
            Try Free
          </MagneticButton>
          <MagneticButton variant="secondary">Talk to Sales</MagneticButton>
        </div>

        <p className="mt-6 text-xs text-muted">
          No credit card required · Free 14-day trial
        </p>
      </motion.div>
    </section>
  );
}
