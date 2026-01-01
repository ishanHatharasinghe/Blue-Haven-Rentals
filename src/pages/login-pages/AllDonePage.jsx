import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";

const AllDonePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 sm:p-14 w-full max-w-lg relative z-20 border border-white/30 animate-fadeInUp text-center">
        {/* Check Icon */}
        <div className="border-5 border-green-500 w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full">
          <FcCheckmark className="p-2 bg-white w-16 h-16 rounded-full" />
        </div>

        {/* Title */}
        <h1 className="font-hugiller text-[50px] sm:text-[80px] md:text-[100px] lg:text-[110px] text-[#263D5D] leading-[1.1] mb-4 ">
          All
          <br />
          <span className="flex items-center justify-center text-[#3ABBD0] relative">
            Done !
          </span>
        </h1>

        <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
          Let's go
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group mb-4"
        >
          <span className="relative z-10">Continue to Login</span>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        <div className="flex items-center justify-center gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
          <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
          <span className="font-montserrat font-thin whitespace-nowrap truncate">
            Discover quality, comfort, and convenience with us.
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
        </div>
      </div>

      {/* Gradient overlay for small screens */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#DFECF8]/80 to-transparent opacity-100 block md:hidden"></div>

      {/* Animations */}
      <style>{`
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

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
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
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AllDonePage;
