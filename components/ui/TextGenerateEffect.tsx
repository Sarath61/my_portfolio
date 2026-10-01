import React from "react";
import { cn } from "@/utils/cn";

/**
 * Staggered word entrance for the hero headline.
 *
 * The previous implementation used framer-motion's `useAnimate` to animate
 * `filter: blur(10px) -> blur(0px)` on every word with `stagger(0.2)`. Two
 * problems:
 *
 *   1. `filter` is not a compositable property, so each of the seven words
 *      forced a text re-rasterization on every frame.
 *   2. The words start at `opacity-0` and the stagger ran ~1.4s, which means the
 *      page's LCP element was invisible for over a second after paint.
 *
 * This version is plain CSS: `opacity` + `translate3d`, a 40ms stagger via a
 * `--i` custom property, and the whole headline is legible in ~0.6s. There is no
 * client-side JS and no `useEffect`, so the component is a server component
 * again and framer-motion leaves the hero's critical path entirely.
 */
export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  /** When false, the headline paints immediately with no entrance animation. */
  filter?: boolean;
  duration?: number;
}) => {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <h1 className="leading-snug tracking-wide text-black dark:text-white">
          {wordsArray.map((word, idx) => (
            <span
              key={word + idx}
              className={cn(
                idx > 3 ? "text-purple" : "text-black dark:text-white",
                filter && "anim-rise"
              )}
              style={
                filter
                  ? ({
                      ["--i" as string]: idx,
                      animationDuration: `${duration}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {word}{" "}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};
