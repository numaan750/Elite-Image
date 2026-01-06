"use client";

import Image from "next/image";
import React from "react";

const Showcase = () => {
  return (
    <div className="py-10">
      <div className="mycontainer">
        <div className="text-center mb-12 max-w-[900px] mx-auto">
          <h2 className="text-[24px] md:text-[36px] font-semibold mb-3">
            Showcase Real Transformations
          </h2>
          <p className="text-[#000000] text-[16px] md:text-[18px]">
            See how EliteImage AI transforms ordinary property photos into
            stunning, market-ready visuals using HDR, sky replacement, grass
            enhancement, object removal, & day-to-dusk effects — instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase1.webp"
              alt="Showcase 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase2.webp"
              alt="Showcase 2"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase3.webp"
              alt="Showcase 3"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase4.webp"
              alt="Showcase 4"
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase5.webp"
              alt="Showcase 5"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/showcase6.webp"
              alt="Showcase 6"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
