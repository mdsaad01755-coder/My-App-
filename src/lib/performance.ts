/**
 * Performance tier detection.
 *
 * Used to progressively enhance (or gracefully degrade) animation-heavy
 * effects based on the device's real capabilities, rather than assuming
 * every visitor is on a fast desktop.
 *
 * Tiers:
 *  - "off"  : prefers-reduced-motion is set → no non-essential motion at all
 *  - "low"  : weak CPU and/or slow/limited network → skip heavy scroll FX,
 *             keep only cheap opacity/transform transitions
 *  - "full" : everything enabled (parallax, scroll-linked transforms, etc.)
 */

export type AnimationTier = "off" | "low" | "full";

interface NavigatorConnection {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
}

function getConnection(): NavigatorConnection | undefined {
  if (typeof navigator === "undefined") return undefined;
  // Not in the standard lib.dom types yet, so we read it defensively.
  const nav = navigator as Navigator & {
    connection?: NavigatorConnection;
    mozConnection?: NavigatorConnection;
    webkitConnection?: NavigatorConnection;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getAnimationTier(): AnimationTier {
  if (typeof window === "undefined") return "full"; // SSR default, corrected on mount

  if (prefersReducedMotion()) return "off";

  const cores = navigator.hardwareConcurrency ?? 8;
  const connection = getConnection();

  const isSlowNetwork =
    !!connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g" ||
    (typeof connection?.downlink === "number" && connection.downlink < 1.5);

  const isWeakCpu = cores > 0 && cores <= 4;

  if (isWeakCpu || isSlowNetwork) return "low";

  return "full";
}

/**
 * Subscribes to prefers-reduced-motion changes at runtime (e.g. the user
 * toggles the OS setting while the tab is open) and re-evaluates the tier.
 * Returns an unsubscribe function.
 */
export function watchAnimationTier(
  callback: (tier: AnimationTier) => void
): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => callback(getAnimationTier());

  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}
