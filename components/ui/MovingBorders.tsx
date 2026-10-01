import React from "react";
import { cn } from "@/utils/cn";

/**
 * Card with a glowing border highlight.
 *
 * The previous `MovingBorder` ran a framer-motion `useAnimationFrame` loop per
 * card that called `pathRef.current.getTotalLength()` once and
 * `getPointAtLength(val)` twice on every frame, then fed the result through
 * `useMotionTemplate` into an inline transform. With four cards mounted that is
 * ~720 forced SVG geometry measurements per second on the main thread, every one
 * of which can trigger layout. The card body also carried `backdrop-blur-xl`, so
 * each frame of that movement forced a 24px backdrop blur to re-sample.
 *
 * The same "light travelling the edge" look is now a single conic gradient
 * rotating behind an inset opaque panel. One compositor-driven `rotate` per
 * card, no JS, no geometry queries, no backdrop filter.
 *
 * `duration` is kept and now maps straight onto `animation-duration`.
 */
export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 4000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden bg-transparent p-[1px] text-xl md:col-span-2",
        containerClassName
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      <MovingBorder duration={duration} borderClassName={borderClassName} />

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900 text-sm text-white antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

/**
 * The rotating highlight itself. Kept as a named export for compatibility; it
 * no longer takes `children` / `rx` / `ry` because there is no SVG path to walk.
 */
export const MovingBorder = ({
  duration = 4000,
  borderClassName,
}: {
  duration?: number;
  borderClassName?: string;
}) => {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {/* aspect-square at 140% width guarantees the rotating gradient always
          covers the card's diagonal, with no oversized `inset-[-1000%]` layer. */}
      <span
        className={cn(
          "absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 animate-spin bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,#0ea5e9_75%,#38bdf8_85%,transparent_100%)] opacity-80 [will-change:transform]",
          borderClassName
        )}
        style={{ animationDuration: `${duration}ms` }}
      />
    </span>
  );
};
