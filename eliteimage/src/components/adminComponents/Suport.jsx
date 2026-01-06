"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "How do I upload images?",
    a: 'Click on "Upload Images" from your dashboard, then drag and drop your images or click "Browse Files" to select them from your computer. You can upload JPG, PNG, and HEIC formats.',
  },
  {
    q: "What is the maximum file size?",
    a: "Maximum file size depends on your plan.",
  },
  {
    q: "How long does processing take?",
    a: "Most images are processed within seconds.",
  },
  {
    q: "Can I edit multiple images at once?",
    a: "Yes, batch editing is supported.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "You can upgrade your plan to get more credits.",
  },
];

export default function Support() {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen bg-white px-7 sm:px-10 py-6 sm:py-8">
      <h3 className="text-[18px] sm:text-[20px] font-semibold mb-6 sm:mb-14">
        Eliteimage Ai
      </h3>
      <h2 className="text-[20px] sm:text-[24px] font-semibold mb-4 sm:mb-8">
        How Can We Help?
      </h2>

      <div className="max-w-full sm:max-w-3xl space-y-2 sm:space-y-3">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border-l-4 border-[#034F75] bg-[#D3E7F0] rounded-md overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base"
            >
              <span className="font-medium text-sm">
                {i + 1}. {item.q}
              </span>
              {open === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {open === i && (
              <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-600">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
