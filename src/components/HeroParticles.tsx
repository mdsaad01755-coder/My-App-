"use client";

import { useEffect, useRef } from "react";
import { getAnimationTier } from "@/lib/performance";

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  opacity: number;
  hue: "violet" | "blue" | "silver";
}

const COLORS: Record<Particle["hue"], string> = {
  violet: "124,92,255",
  blue: "62,142,255",
  silver: "199,201,214",
};

/**
 * Subtle bokeh-style floating dots behind the Hero content. Pure canvas,
 * no per-particle DOM nodes (cheap even with a few dozen of them), and
 * gated hard by the shared performance tier:
 *  - "off" (reduced motion): doesn't render at all — the effect bails
 *    before touching the canvas
 *  - "low" (weak CPU / slow network): roughly a third as many particles
 *  - "full": full particle count
 *
 * Purely decorative — canvas is aria-hidden and sits behind everything
 * with pointer-events disabled. Tier is read once on mount rather than
 * watched live: this is ambient background texture, not worth tearing
 * down and rebuilding a canvas loop mid-session over a tier change.
 */
export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tier = getAnimationTier();
    if (tier === "off") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const count = tier === "low" ? 14 : 34;
    const hues: Particle["hue"][] = ["violet", "blue", "silver"];

    function makeParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 2.5,
        speed: 0.08 + Math.random() * 0.12,
        drift: (Math.random() - 0.5) * 0.15,
        opacity: 0.15 + Math.random() * 0.25,
        hue: hues[Math.floor(Math.random() * hues.length)],
      };
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? window.innerWidth;
      height = rect?.height ?? window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, makeParticle);
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS[p.hue]}, ${p.opacity})`;
        ctx.filter = "blur(1px)";
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
