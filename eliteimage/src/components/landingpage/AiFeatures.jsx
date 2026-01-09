"use client";
import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Enhance",
    desc: "Basic enhancement",
    Image: "/LandingPage/Enhance.webp",
    route: "/admin/enhance",
  },
  {
    title: "HDR",
    desc: "Merge exposures",
    Image: "/LandingPage/HDR.webp",
    route: "/admin/hdr",
  },
  {
    title: "Grass Replacement",
    desc: "Green lawns",
    Image: "/LandingPage/Grass.webp",
    route: "/admin/grass-replacement",
  },
  {
    title: "Object Removal",
    desc: "Remove items",
    Image: "/LandingPage/Object-Removel.webp",
    route: "/admin/object-removal",
  },
  {
    title: "Sky Replacement",
    desc: "Perfect skies",
    Image: "/LandingPage/Sky.webp",
    route: "/admin/sky-replacement",
  },
  {
    title: "Virtual Staging",
    desc: "Furnish rooms",
    Image: "/LandingPage/Virtual-Staging.webp",
    route: "/admin/virtual-staging",
  },
  {
    title: "Day to Dusk",
    desc: "Transform twilight",
    Image: "/LandingPage/Day-to-Dusk.webp",
    route: "/admin/day-to-dusk",
  },
  {
    title: "Straighten",
    desc: "Fix angle",
    Image: "/LandingPage/Straighten.webp",
    route: "/admin/straighten",
  },
  {
    title: "Watermark Remove",
    desc: "Clean branding",
    Image: "/LandingPage/Watermark-Remove.webp",
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
                  width={600}
                  height={400}
                  quality={75}
                  className="w-full h-full object-cover"
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
