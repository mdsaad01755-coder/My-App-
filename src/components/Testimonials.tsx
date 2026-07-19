"use client";

import { motion, type Variants } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We cut our release cycle in half within the first month. Nimbus just gets out of the way and lets the team focus on shipping.",
    name: "Sarah Chen",
    role: "Product Lead at Northwind",
    initials: "SC",
  },
  {
    quote:
      "Finally, one workspace instead of five disconnected tools. Onboarding new hires used to take a week — now it's a single afternoon.",
    name: "Marcus Ibrahim",
    role: "Engineering Manager at Fluvio",
    initials: "MI",
  },
  {
    quote:
      "The analytics alone paid for the upgrade. We spot bottlenecks before they slow the whole team down, not after.",
    name: "Priya Raman",
    role: "Head of Operations at Ledgerly",
    initials: "PR",
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

export default function Testimonials() {
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
            Testimonials
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
            Loved by teams everywhere.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted sm:text-lg">
            See what our customers have to say.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.1 + i * 0.1}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col rounded-2xl border border-border bg-white/[0.02] p-8 transition-colors duration-300 hover:border-violet/40 hover:bg-white/[0.04]"
            >
              {/* Star rating */}
              <div className="flex items-center gap-1">
                <span className="sr-only">Rated 5 out of 5 stars</span>
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <Star
                    key={starIdx}
                    aria-hidden="true"
                    className="h-4 w-4 fill-violet text-violet"
                    strokeWidth={0}
                  />
                ))}
              </div>

              <p className="mt-5 flex-1 text-balance text-sm leading-relaxed text-muted sm:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-blue text-xs font-semibold text-white"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
