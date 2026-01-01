import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Img from "../../assets/images/background/post-back.webp";
import Man from "../../assets/images/others/Img-6.webp";
import ArrowIcon from "../../assets/images/icons/rightArrow.webp";
import Modal from "../../components/Modal";
import Temp from "./temp";
const PostAdd = () => {
  const navigate = useNavigate();
  const { user, userProfile, isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
    onClose: null
  });

  // Helper function to show alert modal
  const showAlert = (type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  };

  const handleAddPostClick = () => {
    // Check if user is logged in
    if (!user) {
      showAlert(
        "warning",
        "Login Required",
        "Please login to post an ad.",
        () => {
          navigate("/login");
        }
      );
      return;
    }

    // Check if user is a boarding owner or admin
    if (
      userProfile?.role === "boarding_owner" ||
      userProfile?.userType === "boarding_owner" ||
      isAdmin()
    ) {
      navigate("/post-add");
      return;
    }

    // Show modal for users with other roles
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Flex column for mobile, row for desktop */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-20 min-h-[80vh]">
            {/* Text Content - Mobile First, Desktop Second */}
            <div className="order-1 lg:order-2 p-4 sm:p-8 lg:p-12 flex-1 flex flex-col items-center justify-center text-center lg:items-start lg:text-left animate-fadeInUp">
              <h1 className="font-[Hugiller-Demo] whitespace-nowrap text-[60px] sm:text-[90px] md:text-[110px] lg:text-[120px] text-[#263D5D] leading-[1.1] mb-6">
                Post Your <span className="text-[#3ABBD0] relative">Add</span>
              </h1>

              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-6 opacity-80 max-w-xl backdrop-blur-2xl p-5 rounded-[20px]">
                Discover the smarter way to rent – effortlessly list your
                boarding rooms, houses, hostels, or luxury apartments on our
                all-in-one platform. We bridge the gap between property owners
                and a vibrant community of renters actively searching for their
                perfect place to call home. Whether it's a cozy room or a lavish
                apartment, we make connecting simple, fast, and stress-free.
              </p>

              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={handleAddPostClick}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group flex items-center gap-2 sm:gap-3"
                >
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <img
                      src={ArrowIcon}
                      alt="Arrow"
                      className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                    <span className="text-sm sm:text-base lg:inline">
                      Add Post
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>

            {/* Man Image - Mobile Second, Desktop First */}
            <div className="p-42 order-2 lg:order-1 flex-1 flex items-center justify-center animate-slideInLeft w-full">
              <div className="relative max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[400px]  mx-auto flex items-center justify-center">
                {/* Decorative Elements - Scaled for mobile */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 bg-[#3ABBD0]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-16 sm:h-16 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>

                {/* Main Image Container */}
                <div className="relative z-10 flex items-center justify-center w-full">
                  <img
                    src={Man}
                    alt="Professional man with house model"
                    className=" absolute max-w-[500px] h-auto mt-30 mb-12  object-contain transform hover:scale-105 transition-transform duration-500
             sm:w-auto
             w-[400px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={Img}
          alt="Modern house background"
          className="object-cover w-full h-full"
        />
        {/* Existing color overlay */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>

        {/* White gradient overlay with blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-white/0 to-white/0 backdrop-blur-[1px]"></div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fadeInUp">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#3ABBD0]/10">
                  <svg
                    className="h-6 w-6 text-[#3ABBD0]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#263D5D] mb-4">
                Boarding Owners Only
              </h3>

              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Only boarding owners can post ads. If you want to post an ad,
                register as a boarding owner.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-[#263D5D] hover:bg-[#303435] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Register as Owner
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          if (alertConfig.onClose) {
            alertConfig.onClose();
          }
        }}
        title={alertConfig.title}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                alertConfig.type === "error"
                  ? "bg-red-100"
                  : alertConfig.type === "warning"
                  ? "bg-yellow-100"
                  : alertConfig.type === "success"
                  ? "bg-green-100"
                  : "bg-blue-100"
              }`}
            >
              {alertConfig.type === "error" && (
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {alertConfig.type === "warning" && (
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
              {alertConfig.type === "success" && (
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {alertConfig.type === "info" && (
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="text-gray-700 whitespace-pre-line">
                {alertConfig.message}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setShowAlertModal(false);
                if (alertConfig.onClose) {
                  alertConfig.onClose();
                }
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                alertConfig.type === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : alertConfig.type === "warning"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : alertConfig.type === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

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
          animation: slideInRight 0.8s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @media (min-width: 475px) {
          .xs\:text-\[40px\] {
            font-size: 40px;
          }
          .xs\:max-w-\[320px\] {
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
};

export default PostAdd;
