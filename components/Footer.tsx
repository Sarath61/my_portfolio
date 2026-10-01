import React from "react";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from "@/data";

const Footer = () => {
  return (
    <footer className="w-full pb-10 mb-[100px] md:mb-5" id="contact">
      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your </span>digital
          presence to the next level?
        </h1>
        <p className="my-5 text-center text-white-200 md:mt-10">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:sarathsai4602@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm font-light md:text-base md:font-normal">
          Copyright © 2024 Sarath Sai Jupalli
        </p>

        <div className="flex items-center gap-6 md:gap-3">
          {socialMedia.map((profile) => (
            <a
              key={profile.id}
              href={profile.url ?? "#"}
              target="_blank"
              rel="noreferrer noopener"
              // `backdrop-filter: blur(16px)` plus the (non-existent)
              // `saturate-180` class sat on top of an opaque background, so the
              // blur had nothing to sample and only cost a compositing layer
              // each. Solid background instead.
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-black-300 bg-black-200 transition-transform duration-200 hover:scale-110"
            >
              <img
                src={profile.img}
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
                loading="lazy"
                decoding="async"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
