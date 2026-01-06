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
              src="/LandingPage/showcase/IMAGE-1.webp"
              alt="Showcase 1"
              fill
              className="object-cover"
            />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/IMAGE-2.webp"
              alt="Showcase 2"
              fill
              className="object-cover"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/IMAGE-3.webp"
              alt="Showcase 3"
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/IMAGE-4.webp"
              alt="Showcase 4"
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/IMAGE-5.webp"
              alt="Showcase 5"
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
            <Image
              src="/LandingPage/showcase/IMAGE-6.webp"
              alt="Showcase 6"
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
                <div className="flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
