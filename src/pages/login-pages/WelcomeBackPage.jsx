import { Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { login } from "../../firebase/authService";
import PasswordInput from "../../components/PasswordInput";
import Img from "../../assets/images/background/hero-background.webp";

const WelcomeBackPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
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
        await login(formData.email, formData.password);
        navigate("/browse");
      } catch (error) {
        let errorMessage = "Failed to login. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password.";
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
                Welcome <br />
                <span className="text-[#3ABBD0] relative">Back !</span>
              </h1>
              <p className="font-montserrat text-lg md:text-xl text-[#303435] mb-4 opacity-80">
                Welcome back to the Blue Haven Rentals
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
                <BsStars className="w-[25px] sm:w-[30px] text-[#3ABBD0] animate-spin-slow" />
                <span className="font-montserrat font-thin whitespace-nowrap truncate">
                  Discover quality, comfort, and convenience with us.
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl  p-12 sm:p-12 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

            <div className="mt-12 mb-12 relative z-10">
              {/* General Error */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-sm">
                  {errors.general}
                </div>
              )}

              {/* Email */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                  <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                      errors.email
                        ? "border-red-500"
                        : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">{errors.email}</p>
                )}
              </div>

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
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2">{errors.password}</p>
                )}
                {/* Forgot password link */}
                <p className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-[#3ABBD0] hover:text-cyan-700 font-semibold transition-colors duration-300"
                  >
                    Forgot password?
                  </button>
                </p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="relative overflow-hidden w-full bg-[#263D5D] hover:bg-[#303435] text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {isLoading ? "Logging in..." : "Login"}
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>

              <p className="text-center text-[#263D5D] text-sm sm:text-base">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-[#3ABBD0] hover:text-cyan-700 font-semibold transition-colors duration-300"
                >
                  Sign Up
                </button>
              </p>
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

export default WelcomeBackPage;
