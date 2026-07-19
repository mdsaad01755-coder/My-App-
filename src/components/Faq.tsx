"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "Can I try Nimbus before paying?",
    answer:
      "Yes — every plan starts with a free 14-day trial, no credit card required. You can invite your team and explore every feature before deciding.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel anytime from your workspace settings — changes take effect on your next billing cycle.",
  },
  {
    question: "Do you offer discounts for nonprofits or students?",
    answer:
      "Yes, we offer 50% off the Pro plan for verified nonprofits, educators, and students. Reach out to our support team once you're signed up.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data stays available for 30 days after cancellation so you can export anything you need. After that, it's permanently deleted from our systems.",
  },
  {
    question: "Is there a limit on integrations?",
    answer:
      "Starter includes our core integrations, while Pro and Enterprise unlock the full library plus custom integrations built for your workflow.",
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

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/[0.02] transition-colors duration-300 hover:border-violet/30">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold text-text sm:text-base">
          {item.question}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 flex-shrink-0 text-muted transition-transform duration-300 ${
            isOpen ? "rotate-180 text-violet" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full bg-panel px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
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
            FAQ
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-text sm:text-4xl md:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-muted sm:text-lg">
            Can&apos;t find what you&apos;re looking for? Reach out to our
            team anytime.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.1}
          variants={fadeUp}
          className="mt-12 flex flex-col gap-4"
        >
          {faqs.map((item, i) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
