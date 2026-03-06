"use client";
import React, { memo } from "react";
import { Facebook, Linkedin, Instagram, Twitter, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer = memo(() => {
  const router = useRouter();
  const handleScroll = (e, targetId) => {
    e.preventDefault();

    if (window.location.pathname === "/") {
      const element = document.getElementById(targetId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else {
      router.push(`/#${targetId}`);
    }
  };

  return (
    <div className="py-10 mt-10 bg-[#034F75] text-white">
      <div className="mycontainer ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-8 ">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">EliteImage</h2>
            <p className="text-sm leading-relaxed">
              Lorem ipsum is simply dummy text of the printing and typesetting
              industry. Lorem ipsum has been the industry&apos;s standard dummy
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-2">Sitemap</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleScroll(e, "home")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleScroll(e, "about-us")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Abouts
                </a>
              </li>
              <li>
                <a
                  href="#growers"
                  onClick={(e) => handleScroll(e, "growers")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#merchants"
                  onClick={(e) => handleScroll(e, "merchants")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleScroll(e, "contact")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-2">Socials</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors flex items-center gap-2"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors flex items-center gap-2"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors flex items-center gap-2"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 transition-colors flex items-center gap-2"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Head Office</h3>
              <p className="text-sm leading-relaxed">
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">News letter</h3>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent border-b border-white/40 pb-2 pr-10 placeholder:text-white/60 focus:outline-none focus:border-white transition-colors"
                />
                <button className="absolute right-0 top-0 hover:opacity-80 transition-opacity">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 text-sm">
          <div
            className="
               grid grid-cols-1 md:grid-cols-3
               gap-4 items-center"
          >
            {/* Email - Left */}
            <div className="text-center md:text-left">
              <a
                href="mailto:example@gmail.com"
                className="border-b border-white p-1 hover:text-gray-300 transition-colors inline-block"
              >
                example@gmail.com
              </a>
            </div>

            {/* Phone - Center */}
            <div className="text-center">
              <a
                href="tel:+11234567890"
                className="border-b border-white p-1 hover:text-gray-300 transition-colors inline-block"
              >
                (123) 456-7890
              </a>
            </div>

            {/* Copyright - Right */}
            <div className="text-center md:text-right">
              © 2020 Elite Image. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

Footer.displayName = "Footer";

export default Footer;
