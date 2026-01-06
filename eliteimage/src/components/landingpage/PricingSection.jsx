import React from "react";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  const router = useRouter();

  const handlePlanClick = (route) => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push(route);
    } else {
      router.push("/login");
    }
  };

  return (
    <div id="pricing" className="py-10">
      <div className="mycontainer">
        <div className="text-center mb-16">
          <h2 className="text-[24px] md:text-[38px] font-bold text-gray-900 mb-4">
            Flexible Pricing
          </h2>
          <p className="text-gray-600 text-[18px] max-w-3xl mx-auto">
            Choose a plan that fits your workflow—powerful AI tools, fast
            processing, and scalable plans for every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6 items-center">
          <div className="bg-[#D3E7F0] rounded-2xl p-10 border border-[#034F75]">
            <div className="flex justify-center mb-3">
              <span className="px-6 py-2 bg-[#D3E7F0] rounded-lg text-[#034F75] font-bold border border-[#034F75]">
                Basic
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="text-[40px] font-bold text-[#034F75] mb-2">
                £22
              </div>
              <div className="text-[#81A7BA]">User/Month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">3 Free Images</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Basic enhancement</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Watermark included</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Standard processing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Email support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick("/pricing/basic")}
              className="w-full bg-[#034F75] text-[#D3E7F0] font-semibold py-4 rounded-xl cursor-pointer"
            >
              Choose Plan
            </button>
          </div>

          <div className="bg-[#034F75] rounded-3xl p-8 lg:py-12 shadow-lg lg:scale-105 relative">
            <div className="flex justify-center mb-3">
              <span className="px-6 py-2 bg-[#034F75] bg-opacity-20 rounded-xl text-white font-bold border border-[#FFFFFF] border-opacity-30">
                Pro
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="text-[45px] font-bold text-white mb-1">
                £49.99
              </div>
              <div className="text-[#D3E7F0]">User/Month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Unlimited HD images</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">No watermark</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">All AI add-ons included</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Priority processing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Advanced features</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Sky replacement</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Virtual staging</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white">Priority support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick("/pricing/pro")}
              className="w-full bg-white  text-[#034F75] font-semibold py-4 rounded-xl cursor-pointer"
            >
              Choose Plan
            </button>
          </div>

          <div className="bg-[#D3E7F0] rounded-2xl p-10 border border-[#034F75]">
            <div className="flex justify-center mb-3">
              <span className="px-6 py-2 bg-[#D3E7F0] rounded-lg text-[#034F75] font-bold border border-[#034F75]">
                Agency
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="text-[40px] font-bold text-[#034F75] mb-2">
                £99.99
              </div>
              <div className="text-[#81A7BA]">User/Month</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">3 Free Images</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Basic enhancement</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Watermark included</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Standard processing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[#034F75]">Email support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePlanClick("/pricing/agency")}
              className="w-full bg-[#034F75] text-[#D3E7F0] font-semibold py-4 rounded-xl cursor-pointer"
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
