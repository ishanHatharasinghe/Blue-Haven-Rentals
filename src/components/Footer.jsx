import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="h-auto bg-gradient-to-br from-blue-100 to-cyan-50 p-4 sm:p-8">
      <footer className="bg-[#1E1E1E] rounded-[40px] text-white p-8 sm:p-10 lg:p-12">
        {/* Top Section: Contact & Form */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 lg:gap-12 mb-10">
          <div className="flex-1 ">
            <h2 className="font-semibold text-[56px] text-[#3ABBD0] leading-none mb-2">
              Contact
            </h2>
            <h3 className=" text-xl text-white font-semibold mb-2">
              Send Your Messages to us
            </h3>
            <p className="text-white/70 text-sm">
              Sign up for our mailing list to receive news and updates about our
              products and services. <br /> You can unsubscribe at any time.
            </p>
          </div>

          {/* Input & Button - Separate in mobile, combined in desktop */}
          <div className="w-full lg:w-auto">
            <form className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:border-2 sm:border-[#3ABBD0] sm:rounded-full sm:p-1">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full sm:flex-1 bg-transparent text-white placeholder-white/60 px-5 py-3 focus:outline-none border-2 border-[#3ABBD0] rounded-full sm:border-0 sm:rounded-none sm:bg-transparent"
              />
              <button
                type="submit"
                className="relative overflow-hidden bg-[#3ABBD0] text-[#1E1E1E] px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 group w-full sm:w-auto whitespace-nowrap min-w-fit"
              >
                <span className="relative z-10 font-montserrat text-sm sm:text-[15px]">
                  <span className="hidden sm:inline">Send Your Messages</span>
                  <span className="sm:hidden">Send Message</span>
                </span>
                <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className=" grid grid-cols-2 sm:grid-cols-4 gap-8 my-12 font-sans">
          <div className="space-y-3">
            <a
              href="#home"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              Contact
            </a>
          </div>
          <div className="space-y-3">
            <a
              href="/browse"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              Find Place
            </a>
            <a
              href="/post-add"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              Add Post
            </a>
          </div>
          <div className="space-y-3">
            <a
              href="/user"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              User
            </a>
          </div>
          <div className="space-y-3">
            <a
              href="/contact"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              FAQ
            </a>  
            <a
              href="/privacy-policy"
              className="text-[23px] font-semibold block text-lg hover:text-[#3ABBD0] transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#3ABBD0]/50 my-8"></div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-baseline gap-4 text-center sm:text-left">
            <span className=" text-2xl text-white Hugiller-font-style ">
              Blue Haven Rentals
            </span>
            <p className="text-white/60 text-xs">
              Copyright 2025. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Facebook"
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaWhatsapp size={22} />
            </a>
            <a
              href="#"
              aria-label="X/Twitter"
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaXTwitter size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
