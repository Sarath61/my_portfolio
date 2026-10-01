import React from "react";

/**
 * "My approach" phase cards.
 *
 * The reveal on each card used to mount `CanvasRevealEffect` - a full
 * `@react-three/fiber` <Canvas> running a custom GLSL shader - inside an
 * `AnimatePresence` keyed on hover state. That meant a WebGL context creation
 * plus a shader compile on *every* hover, which is a 50-300ms synchronous
 * main-thread stall; the hover therefore felt broken rather than snappy. Three
 * cards could each hold a live context, against a browser budget of roughly
 * 8-16 total.
 *
 * The same animated-dot aesthetic is now a `bg-dot` utility (already generated
 * by the Tailwind config as a tiny inline data-URI) layered under a gradient
 * tint, cross-faded with `opacity` on `group-hover`. No WebGL, no shader
 * compile, no mount/unmount, and the effect is on the compositor.
 */
const Approach = () => {
  return (
    <section className="w-full py-20">
      <h1 className="heading">
        My <span className="text-purple">approach</span>
      </h1>
      <div className="my-20 flex flex-col items-center justify-center gap-4 lg:flex-row">
        <Card
          title="Planning & Strategy"
          icon={<AceternityIcon order="Phase 1" />}
          description="We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements."
        >
          <CardReveal className="bg-emerald-900" dotColor="rgba(16,185,129,0.55)" />
        </Card>
        <Card
          title="Development & Progress Update"
          icon={<AceternityIcon order="Phase 2" />}
          description="Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way."
        >
          <CardReveal className="bg-black" dotColor="rgba(236,72,153,0.55)" />
        </Card>
        <Card
          title="Development & Launch"
          icon={<AceternityIcon order="Phase 3" />}
          description="This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up."
        >
          <CardReveal className="bg-sky-700" dotColor="rgba(125,211,252,0.55)" />
        </Card>
      </div>
    </section>
  );
};

/**
 * Lightweight stand-in for the old shader canvas. Kept as a child of `Card` so
 * the component's `children` contract is unchanged.
 */
const CardReveal = ({
  className,
  dotColor,
}: {
  className?: string;
  dotColor: string;
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-3xl ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${dotColor} 1px, transparent 0)`,
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
    </div>
  );
};

const Card = ({
  title,
  icon,
  children,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="group/canvas-card relative mx-auto flex w-full max-w-sm items-center justify-center rounded-3xl border border-black/[0.2] p-4 dark:border-white/[0.2] lg:h-[35rem]">
      <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />

      {/* Always mounted, cross-faded with opacity only. Mounting on hover is
          what made the old version stutter. */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/canvas-card:opacity-100">
        {children}
      </div>

      <div className="relative z-20">
        <div className="absolute left-[50%] top-[50%] mx-auto flex w-full translate-x-[-50%] translate-y-[-50%] items-center justify-center text-center transition duration-200 group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0">
          {icon}
        </div>
        <h2 className="relative z-10 mt-4 text-center text-3xl font-bold text-black opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white">
          {title}
        </h2>
        <h3
          className="relative z-10 mt-4 text-center text-sm font-bold text-black opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white"
          style={{ color: "#e4ecff" }}
        >
          {description}
        </h3>
      </div>
    </div>
  );
};

/**
 * Phase badge. The spinning `inset-[-1000%]` conic gradient plus a sibling
 * `backdrop-blur-3xl` has the same cost profile as the one in MagicButton:
 * an enormous rotating layer being re-sampled by a blur every frame, three
 * times over. Static ring instead.
 */
const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
        <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-2 text-xl font-bold text-white">
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export default Approach;
