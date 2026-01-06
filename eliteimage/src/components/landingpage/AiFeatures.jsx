"use client";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Enhance",
    desc: "Basic enhancement",
    Image: "/LandingPage/AI-Feature1.webp",
    route: "/admin/enhance",
  },
  {
    title: "HDR",
    desc: "Merge exposures",
    Image: "/LandingPage/AI-Feature2.webp",
    route: "/admin/hdr",
  },
  {
    title: "Grass Replacement",
    desc: "Green lawns",
    Image: "/LandingPage/AI-Feature3.webp",
    route: "/admin/grass-replacement",
  },
  {
    title: "Object Removal",
    desc: "Remove items",
    Image: "/LandingPage/AI-Feature4.webp",
    route: "/admin/object-removal",
  },
  {
    title: "Sky Replacement",
    desc: "Perfect skies",
    Image: "/LandingPage/AI-Feature5.webp",
    route: "/admin/sky-replacement",
  },
  {
    title: "Virtual Staging",
    desc: "Furnish rooms",
    Image: "/LandingPage/AI-Feature6.webp",
    route: "/admin/virtual-staging",
  },
  {
    title: "Day to Dusk",
    desc: "Transform twilight",
    Image: "/LandingPage/AI-Feature7.webp",
    route: "/admin/day-to-dusk",
  },
  {
    title: "Straighten",
    desc: "Fix angle",
    Image: "/LandingPage/AI-Feature8.webp",
    route: "/admin/straighten",
  },
  {
    title: "Watermark Remove",
    desc: "Clean branding",
    Image: "/LandingPage/AI-Feature9.webp",
    route: "/admin/watermark-remove",
  },
];

const AiFeatures = () => {
  const router = useRouter();

  const handleFeatureClick = (route) => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push(route);
    } else {
      router.push("/login");
    }
  };

  return (
    <div id="features" className="py-10 bg-white">
      <div className="mycontainer">
        <div className="text-center mb-12">
          <h2 className="text-[24px] md:text-[36px] font-semibold mb-3">
            Powerful AI Features
          </h2>
          <p className="text-[#000000] text-[16px] md:text-[18px]">
            Professional-grade editing tools designed specifically for real
            estate photography
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-[#D3E7F0] rounded-3xl cursor-pointer "
              onClick={() => handleFeatureClick(item.route)}
            >
              <div className="overflow-hidden">
                <Image
                  src={item.Image}
                  alt={item.title}
                  height={200}
                  width={100}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[18px]">{item.title}</h3>
                  <p className="text-[16] text-black">{item.desc}</p>
                </div>

                <div className="h-9 w-9 rounded-full bg-[#034F75] flex items-center justify-center text-white text-lg">
                  <FaArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
