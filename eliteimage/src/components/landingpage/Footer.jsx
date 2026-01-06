"use client";
import React from "react";
import { Facebook, Linkedin, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
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
    <div className="py-10 bg-[#034F75] text-white">
      <div className="mycontainer ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-8 ">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">LOGO</h2>
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
                  Growers
                </a>
              </li>
              <li>
                <a
                  href="#merchants"
                  onClick={(e) => handleScroll(e, "merchants")}
                  className="hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Merchants
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
              <h3 className="text-xl font-semibold mb-3">Newsletter</h3>
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

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex flex-col md:flex-row gap-4 md:gap-90">
            <a
              href="mailto:example@gmail.com"
              className="border-b border-white p-1 hover:text-gray-300 transition-colors"
            >
              example@gmail.com
            </a>
            <a
              href="tel:+11234567890"
              className="border-b border-white p-1 hover:text-gray-300 transition-colors"
            >
              (123) 456-7890
            </a>
          </div>
          <div>
            <span>© 2021 Bike-mage. All rights reserved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
