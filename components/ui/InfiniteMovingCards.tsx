import { cn } from "@/utils/cn";
import React from "react";

const DURATION = {
  fast: "20s",
  normal: "40s",
  slow: "100s",
} as const;

/** "Michael Johnson" -> "MJ" */
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Testimonial marquee.
 *
 * Three fixes:
 *
 *  1. The original cloned every `<li>` with `cloneNode(true)` inside a mount
 *     `useEffect`, then flipped a `start` state - so the browser laid out the
 *     list, mutated the DOM under it, reflowed, and React re-rendered, all after
 *     first paint. The duplicate set is now part of the initial render and
 *     marked `aria-hidden`, so there is a single layout pass and no imperative
 *     DOM work.
 *  2. Speed and direction were written with `style.setProperty` from an effect.
 *     They are plain inline custom properties now, so the animation starts on
 *     the very first frame instead of after a hydration round-trip.
 *  3. Each card rendered `/profile.svg` - a 1.1 MB file containing a
 *     base64-embedded raster, for a 50x50 avatar, ten times over. Replaced with
 *     a CSS gradient monogram, removing 1.1 MB from the initial payload.
 *
 * The `w-screen` container was also overflowing the page's horizontal padding
 * and is now `w-full`.
 */
export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  // Rendered twice so the -50% keyframe loops seamlessly.
  const marquee = [...items, ...items];

  return (
    <div
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      style={
        {
          "--animation-duration": DURATION[speed],
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties
      }
    >
      <ul
        className={cn(
          "animate-scroll flex w-max min-w-full shrink-0 flex-nowrap gap-16 py-4 [will-change:transform]",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {marquee.map((item, idx) => (
          <li
            className="relative w-[90vw] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-800 bg-[#04071d] p-5 md:w-[60vw] md:p-16"
            // The second half is a visual duplicate; hide it from a11y tools.
            aria-hidden={idx >= items.length || undefined}
            key={idx}
          >
            <blockquote>
              <span className="relative z-20 text-sm font-normal leading-[1.6] text-white md:text-lg">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <div
                    aria-hidden="true"
                    className="mb-2 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#CBACF9_0%,#393BB2_100%)] text-sm font-bold text-white"
                  >
                    {initials(item.name)}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold leading-[1.6] text-white">
                      {item.name}
                    </span>
                    <span className="text-sm font-normal leading-[1.6] text-white-200">
                      {item.title}
                    </span>
                  </div>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
