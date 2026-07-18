"use client";

import { motion, type Variants } from "framer-motion";

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "2024", label: "Founded" },
  { value: "10k+", label: "Teams onboard" },
  { value: "99.9%", label: "Uptime" },
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

export default function About() {
  return (
    <section className="relative w-full bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left: story */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0}
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-blue" />
              Our story
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
              Why we started this.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                We were three engineers stitching together a dozen different
                tools just to ship a single feature — one app for planning,
                another for tracking, a third for the numbers nobody
                trusted. Nimbus started as the internal tool we wished we
                had.
              </p>
              <p>
                Today it&apos;s the workspace behind teams who&apos;d rather
                spend their time building than switching tabs. Same
                philosophy, just built for everyone now: fast by default,
                clear by design, and out of your way when it doesn&apos;t
                need to be in it.
              </p>
              <p>
                We&apos;re still small, still opinionated, and still
                shipping every week — because the fastest way to earn trust
                is to keep showing up.
              </p>
            </div>
          </motion.div>

          {/* Right: highlighted stat + stat cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={0.15}
            variants={fadeUp}
            className="flex flex-col gap-6"
          >
            {/* Big highlighted number */}
            <div className="rounded-2xl border border-border bg-white/[0.02] p-10 text-center sm:p-12">
              <p className="font-display text-5xl font-semibold tracking-[-0.02em] text-transparent bg-gradient-to-r from-violet to-blue bg-clip-text sm:text-6xl">
                10,000+
              </p>
              <p className="mt-3 text-sm text-muted">
                teams building faster with Nimbus
              </p>
            </div>

            {/* Supporting stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-white/[0.02] px-4 py-5 text-center transition-colors duration-300 hover:border-violet/40 hover:bg-white/[0.04]"
                >
                  <p className="font-display text-xl font-semibold text-text sm:text-2xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
