import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

const features = [
  {
    title: "Enhance",
    desc: "Basic enhancement",
    Image: "/LandingPage/Enhance.webp",
  },
  {
    title: "HDR",
    desc: "Merge exposures",
    Image: "/LandingPage/HDR.webp",
  },
  {
    title: "Grass Replacement",
    desc: "Green lawns",
    Image: "/LandingPage/Grass.webp",
  },
  {
    title: "Object Removal",
    desc: "Remove items",
    Image: "/LandingPage/Object-Removel.webp",
  },
  {
    title: "Sky Replacement",
    desc: "Perfect skies",
    Image: "/LandingPage/Sky.webp",
  },
  {
    title: "Virtual Staging",
    desc: "Furnish rooms",
    Image: "/LandingPage/Virtual-Staging.webp",
  },
  {
    title: "Day to Dusk",
    desc: "Transform twilight",
    Image: "/LandingPage/Day-to-Dusk.webp",
  },
  {
    title: "Straighten",
    desc: "Fix angle",
    Image: "/LandingPage/Straighten.webp",
  },
  {
    title: "Watermark Remove",
    desc: "Clean branding",
    Image: "/LandingPage/Watermark-Remove.webp",
  },
];

const AIEnhancement = () => {
  return (
    <div className="w-full">
      <main className="bg-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="w-full lg:w-auto">
            <h1 className="text-[16px] sm:text-[18px] lg:text-[20px] font-semibold text-black">
              Eliteimage Ai
            </h1>

            <h2 className="mt-4 sm:mt-6 lg:mt-10 text-[22px] sm:text-[26px] lg:text-[30px] font-semibold text-black leading-tight">
              Welcome Back, Google User
            </h2>

            <p className="mt-2 text-black text-[14px] sm:text-[16px]">
              Transform your real estate images with AI
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-[#034F75] px-4 py-2 text-white w-full sm:w-auto lg:mt-20 hover:bg-[#023d5c] transition-colors justify-center sm:justify-start">
            <span className="text-base mb-1">💳</span>
            <span className="text-[18px] font-medium">Credits : 12</span>
          </button>
        </div>

        <section className="mt-8 sm:mt-12 lg:mt-16">
          <h3 className="text-[20px] sm:text-[32px] font-semibold text-black">
            AI Enhancement Features
          </h3>
        </section>
      </main>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8 pb-6">
        {features.map((item, index) => (
          <Link
            key={index}
            href={`/admin/uploadImage?type=${encodeURIComponent(item.title)}`}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                <Image
                  src={item.Image}
                  alt={item.title}
                  height={200}
                  width={400}
                  quality={100}
                  className="h-48 sm:h-52 lg:h-56 w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-[20px] text-black truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#034F75] flex items-center justify-center text-white text-sm sm:text-base flex-shrink-0 hover:bg-[#023d5c] transition-colors">
                  <FaArrowRight />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIEnhancement;
