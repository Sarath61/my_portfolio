import React from "react";

/**
 * Gradient-ringed CTA button.
 *
 * The original span used `inset-[-1000%]` with `animate-[spin_2s_linear_infinite]`.
 * On a 240x48 button that is a ~1000px square layer rotating forever, and the
 * sibling label carried `backdrop-blur-3xl`, so every frame of that rotation
 * also forced a 64px backdrop blur to re-sample the huge moving layer beneath
 * it. Three of these were mounted permanently (hero, footer, bento card 6).
 *
 * The ring is now a static conic gradient - zero per-frame cost - and the motion
 * moved into a hover-only sheen that translates on the compositor. The
 * `backdrop-blur-3xl` is gone: it sat on top of an opaque `bg-slate-950`, so it
 * was blurring nothing.
 */
const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <button
      type="button"
      className="group relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple/60 md:mt-10 md:w-60"
      onClick={handleClick}
    >
      {/* Static gradient ring. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-lg bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
      />

      <span
        className={`relative inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-slate-950 px-7 py-1 text-sm font-medium text-white transition-transform duration-200 group-active:scale-[0.98] ${otherClasses ?? ""}`}
      >
        {/* Hover sheen: one translate3d on a narrow layer. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/10 transition-transform duration-700 ease-out group-hover:translate-x-[300%]"
        />
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;
