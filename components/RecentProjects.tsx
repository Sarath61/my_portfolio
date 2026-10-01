import { projects } from "@/data";
import React from "react";
import { PinContainer } from "./ui/3d-pin";
import { FaLocationArrow } from "react-icons/fa";

const RecentProjects = () => {
  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of <span className="text-purple">recent project</span>
      </h1>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-20 gap-y-3 p-4">
        {projects.map(({ id, title, des, img, iconLists, link }) => (
          <div
            key={id}
            className="flex h-[32rem] w-[80vw] items-center justify-center sm:h-[41rem] sm:w-[570px] lg:min-h-[32.5rem]"
          >
            <PinContainer title={link} href={link}>
              <div className="relative mb-10 flex h-[30vh] w-[80vw] items-center justify-center overflow-hidden sm:h-[30vh] sm:w-[500px]">
                <div className="relative h-full w-full overflow-hidden bg-[#13162d] lg:rounded-3xl">
                  <img
                    src="/bg.png"
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {/* These screenshots are multi-megabyte SVG-wrapped rasters;
                    lazy loading plus async decode keeps them off the critical
                    path and their decode off the main thread. */}
                <img
                  src={img}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="absolute bottom-0 z-10"
                />
              </div>
              <h2 className="line-clamp-1 text-base font-bold md:text-xl lg:text-2xl">
                {title}
              </h2>
              <p className="line-clamp-2 text-sm font-light lg:text-xl lg:font-normal">
                {des}
              </p>
              <div className="mb-3 mt-7 flex items-center justify-between">
                <div className="flex items-center">
                  {iconLists.map((icon, index) => (
                    <div
                      key={icon}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.2] bg-black lg:h-10 lg:w-10"
                      // The original value had no unit, so the whole
                      // declaration was invalid and silently dropped.
                      style={{ transform: `translateX(-${index * 10}px)` }}
                    >
                      <img
                        src={icon}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="p-2"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="flex text-sm text-purple md:text-xs lg:text-xl">
                    Check Live Site
                  </p>
                  <FaLocationArrow className="ms-3" color="#CBACF9" />
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentProjects;
