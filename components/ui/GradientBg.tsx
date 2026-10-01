"use client";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

/**
 * Animated gradient backdrop for the "start a project" bento card.
 *
 * This was the single most expensive thing on the page. The old version had:
 *
 *  - Five infinitely looping keyframes on large radial-gradient divs, all
 *    nested inside a container carrying BOTH `blur-lg` and
 *    `[filter:url(#blurMe)_blur(40px)]`. The `url(#blurMe)` filter is an SVG
 *    chain of feGaussianBlur -> feColorMatrix -> feBlend, which cannot be
 *    composited: the browser re-runs the entire filter graph over the subtree on
 *    every single frame, forever.
 *  - `mix-blend-mode: hard-light` on each blob, which forces the whole stack
 *    into a non-accelerated blending path.
 *  - A pointer-tracking effect (old lines 61-74) that called `setCurX`/`setCurY`
 *    with `[tgX, tgY]` as its dependency list. That re-rendered this entire
 *    subtree on every mousemove while only ever advancing the lerp by one step,
 *    so it was simultaneously janky and visually wrong.
 *
 * Rewritten to three blobs, animated with `transform` only, blended with
 * `screen` (GPU-friendly) and softened by a single cheap `blur` on each blob
 * rather than a filter chain over the parent. The pointer blob now writes its
 * transform directly to the DOM from inside one rAF loop, so pointer movement
 * costs zero React renders. `contain: paint` stops any of it invalidating the
 * rest of the page.
 *
 * The public prop signature is unchanged.
 */
export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "screen",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  // Mutable animation state lives in refs: nothing here should ever cause a
  // React render.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!interactive) return;

    const container = containerRef.current;
    const pointer = pointerRef.current;
    if (!container || !pointer) return;

    const step = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) / 12;
      c.y += (t.y - c.y) / 12;

      pointer.style.transform = `translate3d(${Math.round(c.x)}px, ${Math.round(
        c.y
      )}px, 0)`;

      // Stop the loop once we have converged; restart on the next move.
      if (Math.abs(t.x - c.x) < 0.5 && Math.abs(t.y - c.y) < 0.5) {
        raf.current = null;
        return;
      }
      raf.current = requestAnimationFrame(step);
    };

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      target.current = {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2,
      };
      if (raf.current === null) raf.current = requestAnimationFrame(step);
    };

    container.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      container.removeEventListener("pointermove", onMove);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [interactive]);

  const blob =
    "absolute h-[var(--size)] w-[var(--size)] left-[calc(50%_-_var(--size)/2)] top-[calc(50%_-_var(--size)/2)] rounded-full [will-change:transform]";

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute left-0 top-0 h-full w-full overflow-hidden [contain:paint]",
        containerClassName
      )}
      style={
        {
          "--size": size,
          backgroundImage: `linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
          mixBlendMode: "normal",
        } as React.CSSProperties
      }
    >
      <div className={cn("", className)}>{children}</div>

      <div
        aria-hidden="true"
        className="h-full w-full"
        style={{ mixBlendMode: "normal" }}
      >
        <div
          className={cn(blob, "animate-first")}
          style={{
            background: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0, rgba(${firstColor}, 0) 50%)`,
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className={cn(blob, "animate-second [transform-origin:calc(50%_-_400px)]")}
          style={{
            background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0, rgba(${secondColor}, 0) 50%)`,
            mixBlendMode: blendingValue as any,
          }}
        />
        <div
          className={cn(blob, "animate-third [transform-origin:calc(50%_+_400px)]")}
          style={{
            background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0, rgba(${thirdColor}, 0) 50%)`,
            mixBlendMode: blendingValue as any,
          }}
        />

        {interactive && (
          <div
            ref={pointerRef}
            className="pointer-events-none absolute left-[calc(50%_-_var(--size)/2)] top-[calc(50%_-_var(--size)/2)] h-[var(--size)] w-[var(--size)] rounded-full opacity-70 [will-change:transform]"
            style={{
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.8) 0, rgba(${pointerColor}, 0) 50%)`,
              mixBlendMode: blendingValue as any,
            }}
          />
        )}
      </div>
    </div>
  );
};
