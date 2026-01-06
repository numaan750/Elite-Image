"use client";
import { Home, Mail, Phone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    option: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          option: formData.option,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Form submitted successfully!");

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        option: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="py-8 lg:py-10">
      <div className="mycontainer grid lg:grid-cols-[1fr_1.5fr] gap-8">
        <div className="w-full h-full flex flex-col justify-center gap-6">
          <h2 className="lg:text-[42px] text-[36px] font-semibold">
            Contact Us
          </h2>
          <p className="lg:text-[18px] text-[16px] max-w-md">
            We are committed to processing the information in order to contact
            you and talk about your project.
          </p>
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            <div className="flex gap-3 sm:gap-4 lg:gap-5 text-sm sm:text-base lg:text-lg">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
              <p className="leading-relaxed">hello@devsrank.com</p>
            </div>
            <div className="flex gap-3 sm:gap-4 lg:gap-5 text-sm sm:text-base lg:text-lg">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
              <p className="leading-relaxed">
                Office #112, 2nd Floor Kohinoor Plaza 1, Faisalabad, Punjab,
                Pakistan
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 lg:gap-5 text-sm sm:text-base lg:text-lg">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0" />
              <p className="leading-relaxed">+92 (300) 1234 968</p>
            </div>
          </div>
        </div>

        <div className="border border-[#034F75] rounded-3xl p-[1.5px]">
          <form
            onSubmit={handleSubmit}
            className="flex-1 rounded-3xl p-4 bg-white flex flex-col justify-center"
          >
            {" "}
            <div className="w-full space-y-8 md:space-y-12 lg:space-y-16 lg:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                <div className="bg-white">
                  <div className="relative max-sm:my-2 bg-inherit">
                    <input
                      type="text"
                      id="firstName"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="peer bg-transparent h-10 w-full placeholder-transparent border-b-2 text-base md:text-lg border-[#0A192F]] focus:outline-none"
                      placeholder=""
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute cursor-pointer left-0 -top-7 bg-inherit font-semibold peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-8 peer-focus:text-gray-400 peer-focus:text-sm md:peer-focus:text-base transition-all"
                    >
                      First Name
                    </label>
                  </div>
                </div>

                <div className="bg-white">
                  <div className="relative max-sm:my-2 bg-inherit">
                    <input
                      type="text"
                      id="lastName"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="peer bg-transparent h-10 w-full placeholder-transparent border-b-2 text-base md:text-lg border-[#0A192F] focus:outline-none"
                      placeholder=""
                    />
                    <label
                      htmlFor="lastName"
                      className="absolute cursor-pointer left-0 -top-7 bg-inherit font-semibold peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-8 peer-focus:text-gray-400 peer-focus:text-sm md:peer-focus:text-base transition-all"
                    >
                      Last Name
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                <div className="bg-white">
                  <div className="relative max-sm:my-2 bg-inherit">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="peer bg-transparent h-10 w-full placeholder-transparent border-b-2 text-base md:text-lg border-[#0A192F] focus:outline-none"
                      placeholder=""
                    />
                    <label
                      htmlFor="email"
                      className="absolute cursor-pointer left-0 -top-7 bg-inherit font-semibold peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-8 peer-focus:text-gray-400 peer-focus:text-sm md:peer-focus:text-base transition-all"
                    >
                      Email
                    </label>
                  </div>
                </div>

                <div className="bg-white">
                  <div className="relative max-sm:my-2 bg-inherit">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="peer bg-transparent h-10 w-full placeholder-transparent border-b-2 text-base md:text-lg border-[#0A192F] focus:outline-none"
                      placeholder=""
                    />
                    <label
                      htmlFor="phone"
                      className="absolute cursor-pointer left-0 -top-7 bg-inherit font-semibold peer-placeholder-shown:text-base md:peer-placeholder-shown:text-lg peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-8 peer-focus:text-gray-400 peer-focus:text-sm md:peer-focus:text-base transition-all"
                    >
                      Phone Number
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
                  Select Subject
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-sm:pl-2 sm:grid-cols-3 gap-4 md:gap-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="General Inquiry"
                      checked={formData.option === "General Inquiry"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-black font-medium text-sm md:text-base">
                      General Inquiry
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="Feedback"
                      checked={formData.option === "Feedback"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-black font-medium text-sm md:text-base">
                      Feedback
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="Others"
                      checked={formData.option === "Others"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-black font-medium text-sm md:text-base">
                      Others
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-[16px] text-[#605F5F] block"
                >
                  Message
                </label>
                <div className="relative pt-3 border-b-2 border-[#0A192F] flex items-end">
                  <input
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    className="w-full text-[16px] md:text-[18px] bg-transparent placeholder:text-sm placeholder:text-[#605F5F] focus:outline-none resize-none border-none"
                  />
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#034F75] text-white"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
