"use client";

import { motion, type Variants } from "framer-motion";
import { Zap, Users, BarChart3, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Automate the repetitive stuff and ship changes in minutes, not sprints.",
  },
  {
    icon: Users,
    title: "Made for teams",
    description:
      "One shared workspace keeps everyone aligned, from planning to launch.",
  },
  {
    icon: BarChart3,
    title: "Clear visibility",
    description:
      "Real-time dashboards show exactly where every project stands.",
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

export default function Features() {
  return (
    <section className="relative w-full bg-base px-6 py-24 sm:py-32">
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
            Why teams choose us
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
            Everything you need,
            <br className="hidden sm:block" /> nothing you don&apos;t.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Nimbus replaces a pile of disconnected tools with one fast,
            focused workspace built for how modern teams actually ship.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.1 + i * 0.1}
              variants={fadeUp}
              className="group relative rounded-2xl border border-border bg-white/[0.02] p-8 transition-colors duration-300 hover:border-violet/40 hover:bg-white/[0.04]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet/20 to-blue/10 ring-1 ring-inset ring-white/10">
                <Icon
                  className="h-5 w-5 text-violet transition-colors duration-300 group-hover:text-blue"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-text">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
