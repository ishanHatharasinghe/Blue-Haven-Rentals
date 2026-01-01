import { Mail } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { isPasswordResetLink, verifyPasswordResetLink, sendPasswordResetWithCode } from "../../firebase/authService";
import Img from "../../assets/images/background/about-background.webp";
import Modal from "../../components/Modal";

const PwdResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [codes, setCodes] = useState(["", "", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
    onClose: null,
  });

  // Helper function to show alert modal
  const showAlert = useCallback((type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  }, []);

  const handleEmailLinkAuth = useCallback(async () => {
    try {
      // Get email from localStorage or prompt user
      let email = localStorage.getItem('emailForPasswordReset');
      if (!email) {
        email = prompt('Please provide your email for confirmation');
        if (!email) {
          navigate("/forgot-password");
          return;
        }
      }

      // Verify the password reset link
      await verifyPasswordResetLink(email);
      
      // Navigate to set new password page
      navigate("/set-new-password", {
        state: { email: email, isEmailLink: true }
      });
    } catch (error) {
      console.error('Email link authentication failed:', error);
      showAlert("error", "Authentication Failed", "Invalid or expired link. Please request a new one.");
    }
  }, [navigate, showAlert]);

  // Check if user came from forgot password page or email link
  useEffect(() => {
    // Check if this is an email link authentication
    if (isPasswordResetLink()) {
      handleEmailLinkAuth();
    } else if (!location.state?.email) {
      navigate("/forgot-password");
    }
  }, [location.state, navigate, handleEmailLinkAuth]);

  const validate = () => {
    let newErrors = {};
    const allFilled = codes.every((code) => code.trim() !== "");
    if (!allFilled) {
      newErrors.codes = "Please enter all digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCodeChange = (index, value) => {
    // Only allow single digit
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Auto-focus next input
      if (value && index < 6) {
        const nextInput = document.querySelector(
          `input[name="code${index + 1}"]`
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[name="code${index - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // For email link flow, we don't need to verify codes here
      // The verification happens when the user clicks the email link
      showAlert("info", "Check Your Email", "Please check your email and click the password reset link to continue.");
    }
  };

  const handleResend = async () => {
    try {
      await sendPasswordResetWithCode(email);
      showAlert("success", "Email Sent", `New password reset email sent to ${email}`);
    } catch (error) {
      let errorMessage = "Failed to resend email. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      showAlert("error", "Resend Failed", errorMessage);
    }
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

        {/* Main Content Wrapper */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
          {/* Left Side - Heading */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="animate-fadeInUp">
              <h1 className="font-hugiller text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] text-[#263D5D] leading-[1.1] mb-4">
                Password <br />
                <span className="text-[#3ABBD0] relative">Reset</span>
              </h1>
              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
                We sent a code to {email}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
                <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
                <span className="font-montserrat font-thin whitespace-nowrap truncate">
                  Discover quality, comfort, and convenience with us.
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Code Verification Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl  p-12 sm:p-12 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="flex mb-6">
                <div className="border-[#3ABBD0]/30 border-2 w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gray-600" />
                </div>
              </div>

              {/* Title */}
              <div className=" mb-8">
                <h2 className="text-[#263D5D] text-2xl font-bold mb-2">
                  Password Reset
                </h2>
                <p className="text-gray-600 text-sm">
                  We sent a code to{" "}
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              {/* Code Input Fields */}
              <div className="mb-8">
                <div className="flex gap-2 mb-4">
                  {codes.map((code, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`code${index}`}
                      value={code}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-xl font-semibold rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 ${
                        errors.codes
                          ? "border-red-500"
                          : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                      }`}
                      maxLength={1}
                    />
                  ))}
                </div>
                {errors.codes && (
                  <p className="text-red-500 text-xs text-center">
                    {errors.codes}
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group mb-6"
              >
                <span className="relative z-10">Continue</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              {/* Resend Link */}
              <div className="text-center mb-6">
                <p className="text-gray-600 text-sm">
                  Didn't receive the email?{" "}
                  <button
                    onClick={handleResend}
                    className="text-[#3ABBD0] hover:text-cyan-700 font-semibold transition-colors duration-300"
                  >
                    Click to resend
                  </button>
                </p>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 text-[#263D5D] hover:text-[#3ABBD0] font-medium transition-colors duration-300 text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to login
                </button>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-8">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={Img}
            alt="Modern house"
            className="object-cover w-full h-full opacity-100"
          />
          <div className="w-full h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 opacity-60"></div>

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

export default PwdResetPage;
