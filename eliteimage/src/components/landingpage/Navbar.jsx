"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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

      setOpen(false);
    }
  };

  return (
    <header className="bg-[#D3E7F0] sticky top-0 z-50">
      <div className="mycontainer py-2 sm:py-3 lg:py-[10px]">
        <div className="flex items-center justify-between">
          {/* <Image
            src="/LandingPage/logo.png"
            alt="Eliteimage Ai"
            width={40}
            height={40}
          /> */}
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
            Eliteimage Ai
          </h2>

          <nav className="hidden md:flex gap-6 lg:gap-10 xl:gap-14 text-black font-medium text-sm lg:text-base xl:text-lg">
            <a
              href="#features"
              onClick={(e) => handleScroll(e, "features")}
              className="hover:text-[#034F75] transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleScroll(e, "pricing")}
              className="hover:text-[#034F75] transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScroll(e, "how-it-works")}
              className="hover:text-[#034F75] transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <a
              href="#about-us"
              onClick={(e) => handleScroll(e, "about-us")}
              className="hover:text-[#034F75] transition-colors cursor-pointer"
            >
              About Us
            </a>
          </nav>
          <Link
            href="/login"
            className="hidden md:block bg-[#034F75] text-white py-2 sm:py-2.5 lg:py-3 px-4 sm:px-5 lg:px-[20px] rounded-lg hover:bg-[#023a57] transition-colors text-sm lg:text-base"
          >
            Log in
          </Link>

          <button
            className="md:hidden p-1"
            onClick={() => setOpen(!open)}
            aria-label="Close modal"
          >
            {open ? (
              <X size={24} className="sm:w-7 sm:h-7" />
            ) : (
              <Menu size={24} className="sm:w-7 sm:h-7" />
            )}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 sm:mt-4 bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 animate-slideDown">
            <nav className="flex flex-col gap-3 sm:gap-4 text-sm sm:text-base font-medium">
              <a
                href="#features"
                onClick={(e) => handleScroll(e, "features")}
                className="hover:text-[#034F75] transition-colors py-1"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleScroll(e, "pricing")}
                className="hover:text-[#034F75] transition-colors py-1"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleScroll(e, "how-it-works")}
                className="hover:text-[#034F75] transition-colors py-1"
              >
                How It Works
              </a>
              <a
                href="#about-us"
                onClick={(e) => handleScroll(e, "about-us")}
                className="hover:text-[#034F75] transition-colors py-1"
              >
                About Us
              </a>

              <Link
                href="/login"
                className="mt-2 sm:mt-3 bg-[#034F75] text-white py-2.5 sm:py-3 px-4 text-center rounded-lg hover:bg-[#023a57] transition-colors"
              >
                Log in
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
