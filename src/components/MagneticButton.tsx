"use client";

import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import gsap from "gsap";
import { getAnimationTier, watchAnimationTier } from "@/lib/performance";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

/**
 * Button with a subtle magnetic pull toward the cursor on hover, plus a
 * soft animated glow ring. GSAP quickTo keeps the follow buttery; the
 * pull distance is intentionally small (max ~10px) so it reads as
 * premium polish rather than a gimmick.
 *
 * On "low"/"off" tiers the magnetic pull is skipped entirely — the
 * button still works and still has its CSS hover states, just without
 * the pointer-tracked transform.
 */
export default function MagneticButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let quickX: ((v: number) => void) | undefined;
    let quickY: ((v: number) => void) | undefined;
    let active = false;

    function handleMove(e: PointerEvent) {
      if (!active || !btn || !quickX || !quickY) return;
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      quickX(relX * 0.25);
      quickY(relY * 0.35);
    }

    function handleLeave() {
      quickX?.(0);
      quickY?.(0);
    }

    function setup() {
      const tier = getAnimationTier();
      active = tier === "full";
      if (!active || !btn) return;

      quickX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      quickY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });

      btn.addEventListener("pointermove", handleMove);
      btn.addEventListener("pointerleave", handleLeave);
    }

    function teardown() {
      btn?.removeEventListener("pointermove", handleMove);
      btn?.removeEventListener("pointerleave", handleLeave);
      gsap.set(btn as HTMLButtonElement, { clearProps: "x,y" });
    }

    setup();
    const unwatch = watchAnimationTier(() => {
      teardown();
      setup();
    });

    return () => {
      unwatch();
      teardown();
    };
  }, []);

  const base =
    "group relative inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet will-change-transform";

  const variantClass =
    variant === "primary"
      ? "text-white bg-gradient-to-r from-violet to-blue"
      : "text-text border border-border-strong hover:border-silver/50 hover:bg-white/[0.04]";

  return (
    <button
      ref={btnRef}
      className={`${base} ${variantClass} ${className}`}
      {...props}
    >
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[2px] -z-10 rounded-full bg-gradient-to-r from-silver via-violet to-blue bg-[length:200%_100%] opacity-0 blur-md transition-opacity duration-500 [animation:border-glow_4s_linear_infinite] group-hover:opacity-70"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
