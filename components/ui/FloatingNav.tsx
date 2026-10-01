"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import Link from "next/link";

/**
 * Scroll-reactive floating navigation.
 *
 * The previous version drove this with framer-motion's `useScroll` +
 * `useMotionValueEvent`, which keeps a per-frame subscription alive for the
 * lifetime of the page and called `setVisible` from inside it. Combined with
 * `AnimatePresence mode="wait"` wrapping a child that never unmounts, every
 * direction change triggered a React render of a fixed, backdrop-filtered
 * element - the most expensive kind of element to invalidate while scrolling.
 *
 * Now: one passive scroll listener, coalesced into a single rAF tick, writing to
 * state only when the boolean actually flips. The show/hide itself is a CSS
 * transition on `transform` + `opacity`, so the compositor handles it.
 */
export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      ticking.current = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? y / max : 0;
      const next = progress < 0.05 ? true : y < lastY.current;

      lastY.current = y;
      // Only re-render on an actual change of state.
      setVisible((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-10 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 px-10 py-5 transition-[transform,opacity] duration-200 ease-out md:min-w-[70vw] lg:min-w-fit",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[120%] opacity-0",
        className
      )}
      style={{
        // Single filter function instead of blur + saturate. Each added function
        // is another full-surface pass on every scroll frame.
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        borderRadius: "50px",
        border: "1px solid rgba(255, 255, 255, 0.125)",
      }}
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className="relative flex items-center space-x-1 text-neutral-600 transition-colors hover:text-neutral-500 dark:text-neutral-50 dark:hover:text-neutral-300"
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="cursor-pointer text-sm">{navItem.name}</span>
        </Link>
      ))}
    </nav>
  );
};
