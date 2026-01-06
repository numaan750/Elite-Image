import Link from "next/link";
import React from "react";

const Pricing = () => {
  return (
    <>
      <h2 className="text-[20px] sm:text-[28px] font-semibold px-4 sm:px-6 lg:px-9 py-3 sm:py-4">
        Eliteimage Ai
      </h2>

      <div
        id="pricing"
        className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-10"
      >
        <div>
          <h2 className="text-[20px] sm:text-[28px] lg:text-[40px] font-semibold mb-6 sm:mb-20">
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-center">
            <div className="bg-[#D3E7F0] rounded-2xl p-5 sm:p-6 lg:p-8 border border-[#034F75]">
              <div className="flex justify-center mb-4">
                <span className="px-4 sm:px-6 py-1 sm:py-2 bg-[#D3E7F0] rounded-lg text-[#034F75] font-bold border border-[#034F75] text-[16px] sm:text-[20.61px]">
                  Basic
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="text-[24px] sm:text-[31.25px] lg:text-[51.53px] font-bold text-[#034F75] mb-1 sm:mb-2">
                  £22
                </div>
                <div className="text-[12px] sm:text-[12.88px] text-[#81A7BA]">
                  User/Month
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    3 Free Images
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Basic enhancement
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Watermark included
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Standard processing
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Email support
                  </span>
                </li>
              </ul>

              <Link
                href="/admin/pricing/payment"
                className="inline-flex w-full items-center justify-center bg-[#034F75] text-[#D3E7F0] font-semibold text-[14px] sm:text-[17.18px] py-3 sm:py-4 rounded-xl cursor-pointer hover:bg-[#023d5c] transition-colors mt-5 sm:mt-7"
              >
                Choose Plan
              </Link>
            </div>

            <div className="bg-[#034F75] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 lg:py-12 shadow-lg lg:scale-105 relative">
              <div className="flex justify-center mb-4">
                <span className="px-4 sm:px-6 py-1 sm:py-2 bg-[#034F75] bg-opacity-20 rounded-xl text-white font-bold border border-[#FFFFFF] border-opacity-30 text-[16px] sm:text-[20.61px]">
                  Pro
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="text-[24px] sm:text-[31.25px] lg:text-[51.53px] xl:text-[51.53px] font-bold text-white mb-1">
                  £49.99
                </div>
                <div className="text-[12px] sm:text-[12.88px] text-[#D3E7F0]">
                  User/Month
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Unlimited HD images
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    No watermark
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    All AI add-ons included
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Priority processing
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Advanced features
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Sky replacement
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Virtual staging
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-white text-[12px] sm:text-[12.88px]">
                    Priority support
                  </span>
                </li>
              </ul>

              <Link
                href="/admin/pricing/payment"
                className="inline-flex w-full items-center justify-center bg-white text-[#034F75] font-semibold text-[16px] sm:text-[17.18px] py-3 sm:py-4 rounded-xl border border-[#034F75] hover:bg-gray-50 transition cursor-pointer"
              >
                Choose Plan
              </Link>
            </div>

            <div className="bg-[#D3E7F0] rounded-2xl p-5 sm:p-6 lg:p-10 border border-[#034F75]">
              <div className="flex justify-center mb-4">
                <span className="px-4 sm:px-6 py-1 sm:py-2 bg-[#D3E7F0] rounded-lg text-[#034F75] font-bold border border-[#034F75] text-[16px] sm:text-[20.61px]">
                  Agency
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="text-[24px] sm:text-[31.25px] lg:text-[51.53px] font-bold text-[#034F75] mb-1 sm:mb-2">
                  £99.99
                </div>
                <div className="text-[12px] sm:text-[12.88px] text-[#81A7BA]">
                  User/Month
                </div>
              </div>

              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    3 Free Images
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Basic enhancement
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Watermark included
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Standard processing
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#2DC937] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[#034F75] text-[12px] sm:text-[12.88px]">
                    Email support
                  </span>
                </li>
              </ul>

              <Link
                href="/admin/pricing/payment"
                className="inline-flex w-full items-center justify-center bg-[#034F75] text-[#D3E7F0] font-semibold text-[14px] sm:text-[17.18px] py-3 sm:py-4 rounded-xl cursor-pointer hover:bg-[#023d5c] transition-colors mt-6 sm:mt-10"
              >
                Choose Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
