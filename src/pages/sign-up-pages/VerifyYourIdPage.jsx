import { useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { useSignup } from "../../context/SignupContext";
import aboutBackground from "../../assets/images/background/about-background.webp";
import Modal from "../../components/Modal";

const VerifyYourIdPage = () => {
  const { formData, updateFormData, nextStep, prevStep } = useSignup();

  const [localData, setLocalData] = useState({
    idNumber: formData.idNumber || "",
    frontImage: formData.frontImage || null,
    backImage: formData.backImage || null,
  });

  const [dragOver, setDragOver] = useState({ front: false, back: false });

  // Refs for hidden file inputs
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
    onClose: null,
  });

  // Helper function to show alert modal
  const showAlert = (type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  };

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.files[0] });
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: true });
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
    const file = e.dataTransfer.files[0];
    if (file) {
      const name = type === "front" ? "frontImage" : "backImage";
      setLocalData({ ...localData, [name]: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localData.idNumber) {
      showAlert(
        "warning",
        "ID Number Required",
        "Please enter your ID number to continue."
      );
      return;
    }
    updateFormData(localData);
    nextStep();
  };

  return (
    <div>
      <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
          {/* Left Side */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="animate-fadeInUp">
              <h1 className="font-hugiller text-[60px] sm:text-[90px] md:text-[100px] lg:text-[110px] text-[#263D5D] leading-[1.1] mb-4">
                Verify your <br />
                <span className="text-[#3ABBD0] relative">Identity</span>
              </h1>
              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-6 opacity-80">
                Verify your identity
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
                <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
                <span className="font-montserrat font-thin whitespace-nowrap truncate">
                  Discover quality, comfort, and convenience with us.
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight"
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              {/* ID Number */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-3">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  National ID / Driving License Number
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="idNumber"
                    value={localData.idNumber}
                    onChange={handleChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 border-[#3ABBD0]/30 focus:border-[#3ABBD0] focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50"
                    placeholder="Enter your ID number"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Upload Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Front Image Upload */}
                <div
                  className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    dragOver.front
                      ? "border-[#3ABBD0] bg-[#3ABBD0]/10"
                      : "border-[#3ABBD0]/40 hover:border-[#3ABBD0]/80"
                  }`}
                  onClick={() => frontInputRef.current.click()}
                  onDragOver={(e) => handleDragOver(e, "front")}
                  onDragLeave={(e) => handleDragLeave(e, "front")}
                  onDrop={(e) => handleDrop(e, "front")}
                >
                  <input
                    ref={frontInputRef}
                    type="file"
                    name="frontImage"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="text-5xl text-[#3ABBD0] mb-3 group-hover:scale-110 transition-transform duration-300">
                    {localData.frontImage ? "✓" : "＋"}
                  </div>
                  <p className="text-sm font-medium text-[#263D5D]">
                    {localData.frontImage
                      ? localData.frontImage.name
                      : "Upload front side"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag & drop or click
                  </p>
                </div>

                {/* Back Image Upload */}
                <div
                  className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    dragOver.back
                      ? "border-[#3ABBD0] bg-[#3ABBD0]/10"
                      : "border-[#3ABBD0]/40 hover:border-[#3ABBD0]/80"
                  }`}
                  onClick={() => backInputRef.current.click()}
                  onDragOver={(e) => handleDragOver(e, "back")}
                  onDragLeave={(e) => handleDragLeave(e, "back")}
                  onDrop={(e) => handleDrop(e, "back")}
                >
                  <input
                    ref={backInputRef}
                    type="file"
                    name="backImage"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="text-5xl text-[#3ABBD0] mb-3 group-hover:scale-110 transition-transform duration-300">
                    {localData.backImage ? "✓" : "＋"}
                  </div>
                  <p className="text-sm font-medium text-[#263D5D]">
                    {localData.backImage
                      ? localData.backImage.name
                      : "Upload back side"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Drag & drop or click
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      (((localData.idNumber ? 1 : 0) +
                        (localData.frontImage ? 1 : 0) +
                        (localData.backImage ? 1 : 0)) /
                        3) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (((localData.idNumber ? 1 : 0) +
                          (localData.frontImage ? 1 : 0) +
                          (localData.backImage ? 1 : 0)) /
                          3) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="relative overflow-hidden bg-[#3ABBD0] hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="relative z-10">Previous</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <button
                  type="submit"
                  className="relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="relative z-10">Next Page</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={aboutBackground}
            alt="Modern house"
            className="object-cover w-full h-full opacity-100"
          />
          <div className="object-cover w-full h-full opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>

          {/* Gradient overlay for small screens only */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#DFECF8]/80 to-transparent opacity-100 block md:hidden"></div>
        </div>
      </div>

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

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyYourIdPage;
