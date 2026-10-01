import React from "react";
import { Button } from "./ui/MovingBorders";
import { workExperience } from "@/data";

// Deterministic per-card durations. The original passed
// `Math.floor(Math.random() * 10000) + 10000` inline, which produced a
// different value on the server than on the client (hydration mismatch) and a
// fresh value on every re-render.
const BORDER_DURATIONS = [11000, 13500, 16000, 18500];

const Experience = () => {
  return (
    <div className="py-20" id="experience">
      <h1 className="heading">
        My <span className="text-purple">Work experience</span>
      </h1>
      <div className="mt-12 grid w-full grid-cols-1 gap-10 lg:grid-cols-4">
        {workExperience.map((card, idx) => (
          <Button
            key={card.id}
            as="div"
            duration={BORDER_DURATIONS[idx % BORDER_DURATIONS.length]}
            borderRadius="1.75rem"
            className="flex-1 border-neutral-200 text-white dark:border-slate-800"
          >
            <div className="flex flex-col p-3 py-6 md:p-5 lg:flex-row lg:items-center lg:p-10">
              <img
                src={card.thumbnail}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="w-16 md:w-20 lg:w-32"
              />
              <div className="lg:ms-5">
                <h2 className="text-start text-xl font-bold md:text-2xl">
                  {card.title}
                </h2>
              </div>
              <p className="mt-3 text-start font-semibold text-white-100">
                {card.desc}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Experience;
