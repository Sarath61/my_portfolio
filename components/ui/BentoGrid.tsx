"use client";
import { cn } from "@/utils/cn";
import { BackgroundGradientAnimation } from "./GradientBg";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MagicButton from "./MagicButton";
import { IoCopyOutline } from "react-icons/io5";

/**
 * The globe pulls in three, three-globe, @react-three/fiber, @react-three/drei
 * and a 580 KB `globe.json` - comfortably the largest chunk in the app. It was
 * previously reached through a static `import { GlobeDemo } from "./GridGlobe"`,
 * so even though GridGlobe lazily imported `Globe` internally, the chunk was
 * requested and evaluated as soon as the grid mounted. Loading it here instead,
 * gated on visibility, keeps WebGL off the critical path entirely.
 */
const GlobeDemo = dynamic(
  () => import("./GridGlobe").then((m) => m.GlobeDemo),
  { ssr: false }
);

/** Mounts children only once the element has been near the viewport. */
function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-row-7 lg:grid-cols-5 lg:gap-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  id?: Number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [cardRef, cardInView] = useInView<HTMLDivElement>();

  const handleCopy = () => {
    navigator.clipboard.writeText("sarathsai4602@gmail.com");
    setCopied(true);
  };

  // Let the confetti replay on a second copy.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div
      ref={cardRef}
      className={cn(
        // `transition duration-200` animated every animatable property,
        // box-shadow included - a repaint of the whole card on hover. Scoped to
        // transform, with a static ring for the hover affordance.
        "group/bento relative row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-3xl border border-white/[0.1] bg-[#04071d] transition-transform duration-200 hover:ring-1 hover:ring-white/20",
        className
      )}
      style={{
        // The original set `backgroundColor: "linear-gradient(...)"`, which is
        // not a valid colour and was discarded by the browser.
        backgroundImage:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`${id === 6 ? "flex justify-center" : ""} h-full`}>
        <div className="absolute h-full w-full">
          {/* Cards 1 and 4 previously loaded `b1.svg` (2.7 MB) and `grid.svg`
              (3.6 MB) - both just decorative washes stored as base64 rasters
              inside an SVG wrapper. Rendered with CSS instead. */}
          {id === 1 && (
            <div aria-hidden="true" className="bento-wash h-full w-full" />
          )}
          {id === 4 && (
            <div
              aria-hidden="true"
              className="h-full w-full bg-grid-white/[0.06] opacity-60"
            />
          )}
          {img && (
            <img
              src={img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={cn(imgClassName, "object-cover object-center")}
            />
          )}
        </div>

        <div
          className={`absolute -bottom-5 right-0 ${
            id === 5 ? "w-full opacity-80" : ""
          }`}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-center"
            />
          )}
        </div>

        {/* Animated gradient only once the card is actually near the viewport. */}
        {id === 6 && cardInView && <BackgroundGradientAnimation />}

        <div
          className={cn(
            titleClassName,
            "relative flex min-h-40 flex-col px-5 p-5 transition-transform duration-200 group-hover/bento:translate-x-2 md:h-full lg:p-10"
          )}
        >
          <div className="z-10 font-sans text-sm font-extralight text-[#C1C2D3] md:max-w-32 md:text-xs lg:text-base">
            {description}
          </div>

          <div className="z-10 max-w-96 font-sans text-lg font-bold lg:text-3xl">
            {title}
          </div>

          {id === 2 && cardInView && <GlobeDemo />}

          {id === 3 && (
            <div className="absolute -right-3 flex w-fit gap-1 lg:-right-2 lg:gap-5">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {["React.js", "Next.js", "JavaScript"].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-[#10132E] px-3 py-2 text-center text-xs opacity-50 lg:px-3 lg:py-4 lg:text-base lg:opacity-100"
                  >
                    {item}
                  </span>
                ))}
                <span className="rounded-lg bg-[#10132E] px-3 py-4 text-center lg:px-3 lg:py-4" />
              </div>
              <div className="flex flex-col gap-3 lg:gap-8">
                <span className="rounded-lg bg-[#10132E] px-3 py-4 text-center lg:px-3 lg:py-4" />
                {["Node.js", "MongoDB", "Express.js"].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-[#10132E] px-3 py-2 text-center text-xs opacity-50 lg:px-3 lg:py-4 lg:text-base lg:opacity-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {id === 6 && (
            <div className="relative mt-5">
              {/* react-lottie plus `confetti.json` added ~614 KB of JSON to the
                  main client bundle, parsed on every page load, for an effect
                  that only ever plays after a click - and the <Lottie> element
                  was mounted unconditionally. The repo already ships
                  `confetti.gif` at 19 KB; render it only when it is needed. */}
              {copied && (
                <div className="absolute -bottom-5 right-0">
                  <img
                    src="/confetti.gif"
                    alt=""
                    aria-hidden="true"
                    width={200}
                    height={200}
                    decoding="async"
                  />
                </div>
              )}
              <MagicButton
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                otherClasses="!bg-[#161a31]"
                handleClick={handleCopy}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
