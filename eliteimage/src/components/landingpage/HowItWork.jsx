import React from "react";
import { LuUpload } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

const HowItWork = () => {
  return (
    <div id="how-it-works" className="py-10 bg-white">
      <div className="mycontainer">
        <div className="text-center mb-8">
          <h2 className="text-[26px] md:text-[36px]  font-semibold mb-3">
            How It Works
          </h2>
          <p className="text-[#000] text-[16px] md:text-[18px]">
            Three simple steps to transform your real estate images
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#034F75] rounded-[24px] p-8 text-white text-center">
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-[#D3E7F0] flex items-center justify-center text-[#034F75]">
              <LuUpload size={26} />
            </div>
            <h3 className="text-[20px] font-semibold mb-2">Upload Images</h3>
            <p className="text-[16px] leading-relaxed text-white">
              Drag and drop or select your real estate image
            </p>
          </div>

          <div className="bg-[#D3E7F0] rounded-[24px] p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-[#034F75] flex items-center justify-center text-white">
              <HiOutlineSparkles size={26} />
            </div>
            <h3 className="text-[20px] font-semibold mb-2 text-[#000]">
              Choose Editing Feature
            </h3>
            <p className="text-[16px] leading-relaxed text-black">
              Select from our suite of AI-powered tools
            </p>
          </div>

          <div className="bg-[#034F75] rounded-[24px] p-8 text-white text-center">
            <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-[#D3E7F0] flex items-center justify-center text-[#034F75]">
              <HiOutlineArrowDownTray size={26} />
            </div>
            <h3 className="text-[20px] font-semibold mb-2">
              Get HD Result in Seconds
            </h3>
            <p className="text-[16px] leading-relaxed text-white">
              Download your professionally edited image instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
