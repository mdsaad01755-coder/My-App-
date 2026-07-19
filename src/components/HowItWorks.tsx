"use client";

import { motion, type Variants } from "framer-motion";
import { UserPlus, Settings2, Rocket } from "lucide-react";

interface Step {
  icon: typeof UserPlus;
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: UserPlus,
    number: "01",
    title: "Create your workspace",
    description:
      "Sign up in seconds and invite your team — no credit card required to start.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Connect your tools",
    description:
      "Bring in the tools you already use with one-click integrations, or start fresh.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Ship with confidence",
    description:
      "Plan, build, and launch from one place — with visibility every step of the way.",
  },
];

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

export default function HowItWorks() {
  return (
    <section className="relative w-full bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          custom={0}
          variants={fadeUp}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-blue" />
            How it works
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
            Up and running in minutes.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Three simple steps between you and a faster-shipping team.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {/* Connector line, desktop only */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block"
          />

          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <motion.div
              key={number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.1 + i * 0.1}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-full border border-border bg-panel">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet/20 to-blue/10 ring-1 ring-inset ring-white/10">
                  <Icon
                    className="h-6 w-6 text-violet"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet to-blue text-[11px] font-semibold text-white">
                  {number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-text">
                {title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
