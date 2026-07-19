"use client";

import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

interface Tier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For small teams just getting off the ground.",
    features: [
      "Up to 5 team members",
      "3 active projects",
      "Basic analytics",
      "Community support",
      "1 GB storage",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams that need more room to move.",
    features: [
      "Up to 25 team members",
      "Unlimited projects",
      "Advanced analytics",
      "Priority email support",
      "50 GB storage",
      "Custom integrations",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with dedicated needs at scale.",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced analytics + reporting",
      "24/7 priority support",
      "Unlimited storage",
      "Custom integrations",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
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

export default function Pricing() {
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
            Pricing
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
            Simple, transparent pricing.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Choose the plan that fits your team — upgrade or downgrade
            anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-center lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1 + i * 0.1}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-colors duration-300 ${
                tier.popular
                  ? "border-violet/50 bg-gradient-to-b from-violet/[0.08] to-transparent lg:-my-4 lg:py-12 lg:shadow-[0_0_60px_-15px_rgba(124,92,255,0.35)]"
                  : "border-border bg-white/[0.02] hover:border-violet/30 hover:bg-white/[0.04]"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet to-blue px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-violet/30">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-text">
                {tier.name}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{tier.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-[-0.02em] text-text">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted">{tier.period}</span>
                )}
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-relaxed text-muted">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <MagneticButton
                variant={tier.popular ? "primary" : "secondary"}
                className={`mt-8 w-full ${
                  tier.popular
                    ? "shadow-[0_0_0_0_rgba(124,92,255,0.5)] hover:shadow-[0_0_40px_4px_rgba(124,92,255,0.45)]"
                    : ""
                }`}
              >
                {tier.cta}
              </MagneticButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
