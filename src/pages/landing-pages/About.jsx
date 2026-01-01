import { BsStars } from "react-icons/bs";
import Bg from "../../assets/images/background/about-background.webp";
import ArrowIcon from "../../assets/images/icons/rightArrow.webp";

const About = () => {
  return (
    <div id="about" className="  min-h-screen  relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 ">
        <img
          src={Bg}
          alt="Modern house"
          className=" flex items-center justify-center object-cover w-full h-full opacity-100"
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
            <h1 className="Hugiller-font-style text-[48px] sm:text-[70px] md:text-[90px] lg:text-[120px] text-[#263D5D] leading-[1.1] mb-4">
              About Blue
              <br />
              Haven <span className="text-[#3ABBD0]">Rentals</span>
            </h1>
            <p className="Hugiller-font-style text-base md:text-[17px] lg:text-[17px] text-[#303435] mb-6 opacity-80 rounded-full  mx-auto  max-w-5xl p-3">
              Your ideal space is just a search away with Blue Haven Rentals.
            </p>

            <div
              className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 w-full sm:w-fit max-w-full
                bg-[#3ABBD0]/90 backdrop-blur-md text-white 
                px-4 sm:px-6 lg:px-8 
                py-3 sm:py-4 lg:py-5 
                rounded-2xl shadow-lg 
                text-sm sm:text-base lg:text-lg 
                border border-white/20"
            >
              <BsStars className="w-[20px] sm:w-[25px] lg:w-[30px] text-white animate-spin-slow" />
              <span className="font-montserrat font-thin text-[18px] sm:text-[20px] tracking-[0.1em] text-center sm:text-left leading-snug">
                Discover quality, comfort, and convenience with us.
              </span>
            </div>
          </div>

          {/* Content Cards */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* What We Offer Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-white/30 animate-slideInLeft group hover:scale-[1.02] transition-all duration-500">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src={ArrowIcon} alt="Arrow" className="w-6 h-6" />
                  <h2 className="Hugiller-font-style text-[36px] md:text-3xl text-[#263D5D] ">
                    What We Offer
                  </h2>
                </div>

                <ul className="space-y-1 text-[#303435]">
                  <li className="flex items-start gap-3 group/item">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm md:text-base leading-relaxed">
                      A curated selection of verified rental houses and boarding
                      accommodations.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm md:text-base leading-relaxed">
                      Intuitive search tools with advanced filtering options.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm md:text-base leading-relaxed">
                      Detailed property listings with comprehensive information
                      and photos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group/item">
                    <div className="w-2 h-2 bg-[#3ABBD0] rounded-full mt-2 group-hover/item:scale-125 transition-transform duration-300"></div>
                    <span className="text-sm md:text-base leading-relaxed">
                      A user-friendly platform for both seekers and advertisers.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Our Mission Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-white/30 animate-slideInRight group hover:scale-[1.02] transition-all duration-500">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <img src={ArrowIcon} alt="Arrow" className="w-6 h-6" />
                  <h2 className="Hugiller-font-style text-[36px] md:text-3xl text-[#263D5D] Hugiller-font-style">
                    Our Mission
                  </h2>
                </div>

                <p className="text-[#303435] text-sm md:text-base leading-relaxed">
                  At Blue Haven Rentals, we believe everyone deserves a place
                  they can call home. Our platform is designed to make finding
                  your next rental or boarding house a seamless and enjoyable
                  experience. We are committed to quality, transparency, and
                  connecting you with spaces where you can thrive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out 0.2s both;
        }
        .animate-slideInDown {
          animation: slideInDown 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
