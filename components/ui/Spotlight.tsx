import React from "react";
import { cn } from "@/utils/cn";

type SpotlightProps = {
  className?: string;
  fill?: string;
};

/**
 * Soft directional glow for the hero.
 *
 * Previously this rendered a 3787x2842 SVG whose single ellipse was pushed
 * through `feGaussianBlur stdDeviation="151"`. Because the element was also the
 * target of the `animate-spotlight` keyframe, the browser had to re-rasterize a
 * multi-megapixel Gaussian blur on the main thread for every frame of the
 * entrance - with three instances mounted in the hero at once. That is the
 * stutter in the first second of page life.
 *
 * A radial gradient is intrinsically soft, so the blur filter is unnecessary.
 * The element animates `opacity` + `transform` only, both of which the
 * compositor handles without touching the main thread. No hooks, so this stays
 * a server component and ships zero JS.
 */
export const Spotlight = ({ className, fill }: SpotlightProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%]",
        className
      )}
    >
      <div
        className="glow-soft h-full w-full -rotate-[35deg] opacity-[0.17]"
        style={{ "--glow-color": fill || "white" } as React.CSSProperties}
      />
    </div>
  );
};
