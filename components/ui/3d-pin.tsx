import React from "react";
import { cn } from "@/utils/cn";

/**
 * 3D "pin" card used by the projects grid.
 *
 * Two separate problems were fixed here:
 *
 *  1. `PinPerspective` rendered three `motion.div`s with `repeat: Infinity` and
 *     a 6s duration. Mounted once per project, that is twelve framer-motion
 *     animation loops running permanently - and the entire subtree is
 *     `opacity-0` until hover, so all of that work was invisible.
 *     `opacity: 0` does not pause an animation. The ripples are now CSS and the
 *     `animate-ripple` class is applied only under `group-hover/pin:`, so the
 *     idle cost is exactly zero.
 *  2. The tilt was held in React state and set from `onMouseEnter` /
 *     `onMouseLeave`, re-rendering a `z-50` subtree on every pointer cross. It
 *     is now a pure CSS `group-hover` transform.
 *
 * The beam also transitioned `h-20 -> h-40` on hover, which is a
 * layout-triggering property; it now uses `scaleY` from a fixed height.
 */
export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn("group/pin relative z-50 cursor-pointer", containerClassName)}
    >
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute left-1/2 top-1/2 flex items-start justify-start overflow-hidden rounded-2xl border border-white/[0.1] p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] transition-transform duration-700 ease-out [transform:translate(-50%,-50%)_rotateX(0deg)] group-hover/pin:border-white/[0.2] group-hover/pin:[transform:translate(-50%,-50%)_rotateX(40deg)_scale(0.8)]">
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <div className="pointer-events-none z-[60] flex h-80 w-full items-center justify-center opacity-0 transition-opacity duration-500 group-hover/pin:pointer-events-auto group-hover/pin:opacity-100">
      <div className="inset-0 -mt-7 h-full w-full flex-none">
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10"
          >
            <span className="relative z-20 inline-block py-0.5 text-xs font-bold text-white">
              {title}
            </span>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0" />
          </a>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Three staggered ripples. The animation class is attached only
              while the pin is hovered, so nothing animates at rest. */}
          {[0, 1, 2].map((step) => (
            <span
              key={step}
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-full bg-sky-500/[0.08] opacity-0 [transform:translate3d(-50%,-50%,0)_scale(0)] group-hover/pin:animate-ripple"
              style={{ animationDelay: `${step * 1.3}s` }}
            />
          ))}
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-1/2 right-1/2 h-20 w-px origin-bottom translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 transition-transform duration-500 ease-out group-hover/pin:scale-y-[2]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-1/2 right-1/2 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-cyan-400 shadow-[0_0_6px_2px_rgba(34,211,238,0.6)]"
        />
      </div>
    </div>
  );
};
