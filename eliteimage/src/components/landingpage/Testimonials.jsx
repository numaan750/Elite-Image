import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Testimonials = () => {
  return (
    <div className="bg-white py-10 ">
      <div className="mycontainer">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <h2 className="text-[38px] md:text-[48px] font-bold text-gray-900 mb-2">
              Client Trust
            </h2>
            <p className="text-black text-[16px] leading-relaxed">
              Real estate agents and photographers rely on EliteImage AI to
              enhance images instantly, reduce editing time, improve listing
              quality, and attract more buyers with consistent, professional
              visual results across platforms and measurable conversion growth.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-[#034F75] rounded-3xl p-8 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <UserCircleIcon className="w-12 h-12 text-[#034F75]" />
                <h3 className="text-[20px] font-semibold text-black">
                  David Thompson
                </h3>
              </div>
              <p className="text-black text-base leading-relaxed mb-4">
                “EliteImage AI has streamlined our entire process. Our listings
                look polished, edits are completed in seconds, and buyer
                engagement has noticeably increased.”
              </p>
              <div className="flex gap-1 text-[#034F75]">
                {Array(5).fill("★")}
              </div>
            </div>

            <div className="border-2 border-[#034F75] rounded-3xl p-8 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <UserCircleIcon className="w-12 h-12 text-[#034F75]" />
                <h3 className="text-[20px] font-semibold text-black">
                  John Cena
                </h3>
              </div>
              <p className="text-black text-base leading-relaxed mb-4">
                "EliteImage AI completely changed our workflow. Listings look
                stunning, edits take seconds, and our properties now attract
                more buyer attention than ever before."
              </p>
              <div className="flex gap-1 text-[#034F75]">
                {Array(5).fill("★")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
