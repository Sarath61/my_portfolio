import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div>
        <Spotlight
          className="-left-10 -top-40 h-screen md:-left-32 md:-top-20"
          fill="white"
        />
        <Spotlight className="left-full top-10 h-[80vh] w-[50vw]" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Grid backdrop. The radial mask is painted once on a static element, so
          it never re-composites during the entrance animations above. */}
      <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-white bg-grid-black/[0.2] dark:bg-black-100 dark:bg-grid-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
      </div>

      <div className="relative z-10 my-10 flex justify-center">
        <div className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[60vw]">
          <div className="rounded-full border-2 border-white-100 bg-gray-900">
            {/* Above the fold: decode eagerly and at high priority, but give the
                browser intrinsic dimensions so it reserves space before load. */}
            <img
              src="/image 1.svg"
              alt="Sarath Sai Jupalli"
              width={180}
              height={180}
              decoding="async"
              fetchPriority="high"
              className="h-[180px] w-[180px] rounded-full"
            />
          </div>

          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Transforming Ideas into Engaging User Interfaces"
          />

          <p className="mb-4 text-center text-sm md:text-lg md:tracking-wide lg:text-2xl">
            Hi, I&apos;m Sarath , Full Stack Developer based in India
          </p>

          <a href="#about">
            <MagicButton
              title="Show my Work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
