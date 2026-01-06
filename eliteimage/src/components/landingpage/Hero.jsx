import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

const FaPlay = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaPlay),
  { ssr: false }
);
const PiUpload = dynamic(
  () => import("react-icons/pi").then((mod) => mod.PiUpload),
  { ssr: false }
);
const Hero = () => {
  return (
    <>
      <section id="home" className="relative flex items-center justify-center">
        <div className="mycontainer relative h-[91vh] flex flex-col justify-center text-center z-10 px-4">
          <Image
            src="/LandingPage/LINES.webp"
            alt="Background Lines"
            fill
            className="object-cover -z-10"
            loading="lazy"
            priority={false}
          />
          <Image
            src="/LandingPage/hero2.webp"
            alt="Hero background shadow"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 100vw"
            quality={50}
            className="object-cover -z-10"
            placeholder="blur"
            blurDataURL="/LandingPage/hero2-blur.png"
          />

          <div className="py-10 sm:py-20 lg:py-40">
            <h1 className="text-[38px] sm:text-[38px] md:text-[48px] font-bold text-[#034F75] leading-[38px] sm:leading-[50px] md:leading-[60px] px-2">
              Instant Real Estate Image <br className="hidden sm:block" />{" "}
              Enhancement Powered by AI
            </h1>

            <p className="mt-[16px] sm:mt-[20px] text-[14px] sm:text-[18px] md:text-[20px] text-[#000000] max-w-5xl mx-auto leading-[24px] sm:leading-[28px] md:leading-[30px] px-4">
              Transform property photos with pro-grade editing in seconds — HDR,
              sky replacement, object removal, virtual staging, and more.
            </p>

            <div className="mt-[24px] sm:mt-[30px] flex flex-col sm:flex-row justify-center gap-[16px] sm:gap-[25px] px-4">
              <button
                className="bg-[#034F75] text-white px-[20px] sm:px-[24px] py-[12px] sm:py-[14px] rounded-xl text-[14px] sm:text-[16px] font-medium flex items-center gap-[10px] justify-center min-w-[180px] hover:bg-[#023a57] transition-colors"
                aria-label="Upload Image"
              >
                <PiUpload className="text-[16px] sm:text-[20px]" />
                Upload Image
              </button>

              <button
                className="border-2 border-[#034F75] text-[#034F75] px-[20px] sm:px-[24px] py-[12px] sm:py-[14px] rounded-xl text-[14px] sm:text-[16px] font-medium flex items-center gap-[10px] justify-center min-w-[180px] hover:bg-[#034F75] hover:text-white transition-colors"
                aria-label="Watch Demo"
              >
                <FaPlay className="text-[14px] sm:text-[18px]" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mycontainer mt-[40px] sm:mt-[50px] lg:mt-[60px] flex justify-center">
        <div className="relative w-full max-w-[1440px] h-[300px] sm:h-[400px] lg:h-[500px] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden shadow-lg">
          <div className="grid grid-cols-2 h-full">
            <div className="relative">
              <Image
                src="/LandingPage/heroimg1.webp"
                alt="Before"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={60}
              />
              <span className="absolute top-[12px] sm:top-[16px] lg:top-[20px] left-[12px] sm:left-[16px] lg:left-[20px] bg-[#034F75] text-white text-[12px] sm:text-[14px] lg:text-[16px] px-[10px] sm:px-[12px] lg:px-[16px] py-[4px] sm:py-[5px] lg:py-[6px] rounded-[6px] lg:rounded-[8px] font-medium">
                Before
              </span>
            </div>

            <div className="relative">
              <Image
                src="/LandingPage/heroimg1.webp"
                alt="Before"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={60}
              />
              {/* <Image
  src="/LandingPage/heroimg1.webp"
  alt="Before real estate image"
  fill
  className="object-cover"
  quality={60}
  sizes="(max-width: 768px) 50vw, 50vw"
/> */}
              <span className="absolute top-[12px] sm:top-[16px] lg:top-[20px] right-[12px] sm:right-[16px] lg:right-[20px] bg-[#034F75] text-white text-[12px] sm:text-[14px] lg:text-[16px] px-[10px] sm:px-[12px] lg:px-[16px] py-[4px] sm:py-[5px] lg:py-[6px] rounded-[6px] lg:rounded-[8px] font-medium">
                After
              </span>
            </div>
          </div>

          <div className="absolute inset-y-0 left-1/2 w-[1px] sm:w-[2px] bg-white/80 z-20"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#034F75] w-12 h-12 sm:w-[40px] sm:h-[40px] lg:w-[44px] lg:h-[44px] rounded-full flex items-center justify-center z-30 shadow-lg">
            <span className="text-white text-[20px] sm:text-[24px] lg:text-[30px]">{`<>`}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
