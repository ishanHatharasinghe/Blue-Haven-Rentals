import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { updatePasswordForCurrentUser } from "../../firebase/authService";
import PasswordInput from "../../components/PasswordInput";
import Img from "../../assets/images/background/hero-background.webp";

const SetNewPwdPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const resetCode = location.state?.code;
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if user came from verification page or email link
  useEffect(() => {
    if (!resetCode && !location.state?.isEmailLink) {
      navigate("/forgot-password");
    }
  }, [resetCode, location.state, navigate]);

  const validate = () => {
    let newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        // Update password for the current user (authenticated via email link)
        await updatePasswordForCurrentUser(formData.password);
        
        // Navigate to success page with user info
        navigate("/password-reset-success", {
          state: { 
            email: location.state?.email,
            isPasswordReset: true 
          }
        });
      } catch (error) {
        let errorMessage = "Failed to reset password. Please try again.";
        if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak. Please choose a stronger password.";
        } else if (error.code === "auth/requires-recent-login") {
          errorMessage = "Please sign in again to change your password.";
        } else if (error.message === "No user is currently signed in") {
          errorMessage = "Session expired. Please request a new password reset.";
        }
        setErrors({ general: errorMessage });
      } finally {
        setIsLoading(false);
      }
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
                Set New <br />
                <span className="text-[#3ABBD0] relative">Password</span>
              </h1>
              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
                Setup your New Password
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
                <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
                <span className="font-montserrat font-thin whitespace-nowrap truncate">
                  Discover quality, comfort, and convenience with us.
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Set New Password Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 sm:p-12 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl "></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="flex  mb-6">
                <div className="border-[#3ABBD0]/30 border-2 w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-600" />
                </div>
              </div>

              {/* Title */}
              <div className=" mb-8">
                <h2 className="text-[#263D5D] text-2xl font-bold mb-2">
                  Set new password
                </h2>
                <p className="text-gray-600 text-sm">
                  Must be at least 8 characters
                </p>
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-sm">
                  {errors.general}
                </div>
              )}

              {/* Password */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Password
                </label>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  showIcon={false}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Confirm Password
                </label>
                <PasswordInput
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  error={errors.confirmPassword}
                  showIcon={false}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isLoading ? "Resetting..." : "Reset Password"}
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

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
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
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

export default SetNewPwdPage;
