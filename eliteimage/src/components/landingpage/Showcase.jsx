// "use client";

// import Image from "next/image";
// import React from "react";

// const Showcase = () => {
//   return (
//     <div className="py-10">
//       <div className="mycontainer">
//         <div className="text-center mb-12 max-w-[900px] mx-auto">
//           <h2 className="text-[24px] md:text-[36px] font-semibold mb-3">
//             Showcase Real Transformations
//           </h2>
//           <p className="text-[#000000] text-[16px] md:text-[18px]">
//             See how EliteImage AI transforms ordinary property photos into
//             stunning, market-ready visuals using HDR, sky replacement, grass
//             enhancement, object removal, & day-to-dusk effects — instantly.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-1.webp"
//               alt="Showcase 1"
//               fill
//               className="object-cover"
//             />

//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-2.webp"
//               alt="Showcase 2"
//               fill
//               className="object-cover"
//             />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h- md:w-12 md:h-12 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-3.webp"
//               alt="Showcase 3"
//               fill
//               className="object-cover"
//             />
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-4.webp"
//               alt="Showcase 4"
//               fill
//               className="object-cover"
//             />
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="md:col-span-2 relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-5.webp"
//               alt="Showcase 5"
//               fill
//               className="object-cover"
//             />
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
//             <Image
//               src="/LandingPage/showcase/IMAGE-6.webp"
//               alt="Showcase 6"
//               fill
//               className="object-cover"
//             />
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/80 z-20" />

//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
//               <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#1f6b8f] flex items-center justify-center">
//                 <div className="flex items-center justify-center text-white">
//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M15 18L9 12L15 6"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>

//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <path
//                       d="M9 6L15 12L9 18"
//                       stroke="currentColor"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Showcase;

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

const ImageComparisonSlider = ({ beforeImage, afterImage, alt }) => {
  // const [sliderPosition, setSliderPosition] = useState(50);
  const sliderPosition = 50;
  // const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // const handleMove = (clientX) => {
  //   if (!containerRef.current) return;

  //   const rect = containerRef.current.getBoundingClientRect();
  //   const x = clientX - rect.left;
  //   const percentage = (x / rect.width) * 100;

  //   setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  // };

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden cursor-ew-resize select-none"
      // onMouseDown={handleMouseDown}
      // onMouseUp={handleMouseUp}
      // onMouseMove={handleMouseMove}
      // onMouseLeave={handleMouseUp}
      // onTouchMove={handleTouchMove}
    >
      <Image src={afterImage} alt={alt} fill className="object-cover" />
      {/* <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={beforeImage}
          alt={`${alt} - Before`}
          fill
          className="object-cover"
          style={{
            objectPosition: "left center",
            width: "100%",
            height: "100%",
          }}
        />
      </div> */}
      <div
        className="absolute top-0 h-full w-[3px] bg-white/80 z-20"
        style={{ left: `${sliderPosition}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 z-30"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="relative -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 rounded-full bg-[#1f6b8f] flex items-center justify-center shadow-lg">
          <div className="flex items-center justify-center text-white">
            <svg
              className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
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
              className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
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
  );
};

const Showcase = () => {
  const images = [
    {
      before: "/LandingPage/showcase/IMAGE-1-before.webp",
      after: "/LandingPage/showcase/IMAGE-1.webp",
      alt: "Showcase 1",
      span: "md:col-span-2",
    },
    {
      before: "/LandingPage/showcase/IMAGE-2-before.webp",
      after: "/LandingPage/showcase/IMAGE-2.webp",
      alt: "Showcase 2",
      span: "",
    },
    {
      before: "/LandingPage/showcase/IMAGE-3-before.webp",
      after: "/LandingPage/showcase/IMAGE-3.webp",
      alt: "Showcase 3",
      span: "",
    },
    {
      before: "/LandingPage/showcase/IMAGE-4-before.webp",
      after: "/LandingPage/showcase/IMAGE-4.webp",
      alt: "Showcase 4",
      span: "md:col-span-2",
    },
    {
      before: "/LandingPage/showcase/IMAGE-5-before.webp",
      after: "/LandingPage/showcase/IMAGE-5.webp",
      alt: "Showcase 5",
      span: "md:col-span-2",
    },
    {
      before: "/LandingPage/showcase/IMAGE-6-before.webp",
      after: "/LandingPage/showcase/IMAGE-6.webp",
      alt: "Showcase 6",
      span: "",
    },
  ];

  return (
    <div className="py-10">
      <div className="mycontainer">
        <div className="text-center mb-8 max-w-[900px] mx-auto">
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
          {images.map((image, index) => (
            <div key={index} className={image.span}>
              <ImageComparisonSlider
                beforeImage={image.before}
                afterImage={image.after}
                alt={image.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Showcase;
