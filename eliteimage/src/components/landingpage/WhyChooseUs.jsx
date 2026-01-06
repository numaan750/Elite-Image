import React from "react";

const WhyChooseUs = () => {
  const handleScroll = (e, targetId) => {
    e.preventDefault();

    const element = document.getElementById(targetId);

    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  return (
    <div id="about-us" className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-0">
      <div className="mycontainer">
        <div className="text-center w-full bg-[#034F75] py-12 sm:py-16 lg:py-20 rounded-2xl sm:rounded-3xl lg:rounded-4xl px-4 sm:px-8 lg:px-12 xl:px-16">
          <h2 className="text-[#D3E7F0] text-2xl sm:text-3xl lg:text-4xl xl:text-[40px] font-bold pb-3 sm:pb-4 lg:pb-6">
            Why Choose EliteImage AI
          </h2>
          <p className="text-white font-medium max-w-full sm:max-w-[600px] lg:max-w-[700px] mx-auto leading-relaxed sm:leading-7 lg:leading-8 pb-5 sm:pb-6 lg:pb-8 text-sm sm:text-base lg:text-lg xl:text-xl">
            EliteImage AI delivers instant results with pro-level quality
            through fully automated, intelligent AI tools. Our platform ensures
            consistent, high-end real estate visuals while remaining affordable,
            fast, and accessible for agents, photographers, and businesses
            worldwide—without manual effort or delays.
          </p>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>
            <button className="bg-[#D3E7F0] text-[#034F75] font-medium cursor-pointer rounded-lg sm:rounded-xl py-2 sm:py-2.5 lg:py-3 px-5 sm:px-6 lg:px-8 text-sm sm:text-base lg:text-lg hover:bg-[#c7def1] transition-colors duration-300">
              Contact Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
