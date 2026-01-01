import { useState } from "react";
import { BsStars } from "react-icons/bs";
import { useSignup } from "../../context/SignupContext";
import categoriesBackground from "../../assets/images/background/categories-background.webp";

const SetupYourAccountPage = () => {
  const { formData, updateFormData, nextStep, prevStep } = useSignup();

  const [localData, setLocalData] = useState({
    username: formData.username || "",
    description: formData.description || "",
    phone: formData.phone || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!localData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (localData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!localData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (localData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    const phoneRegex = /^[0-9]{7,15}$/;
    if (!localData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(localData.phone.trim())) {
      newErrors.phone = "Phone number is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateFormData(localData);
      nextStep();
    }
  };

  const progress =
    ((localData.username ? 1 : 0) +
      (localData.description ? 1 : 0) +
      (localData.phone ? 1 : 0)) /
    3;

  return (
    <div className="p-6 md:p-30 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
        {/* Left Side */}
        <div className="flex-1 max-w-lg text-center lg:text-left animate-fadeInUp">
          <h1 className="font-hugiller text-[60px] sm:text-[90px] md:text-[110px] lg:text-[120px] text-[#263D5D] leading-[1.1] mb-4">
            Setup your <br />
            <span className="text-[#3ABBD0] relative">Account</span>
          </h1>
          <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-4 opacity-80">
            Setup your account details
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#303435]/90 backdrop-blur-md text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg text-sm sm:text-base border border-white/20">
            <BsStars className="w-[20px] sm:w-[25px] text-[#3ABBD0] animate-spin-slow" />
            <span className="font-montserrat font-thin whitespace-nowrap truncate">
              Discover quality, comfort, and convenience with us.
            </span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-5 sm:p-8 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            {/* Username */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={localData.username}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                    errors.username
                      ? "border-red-500"
                      : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                  }`}
                  placeholder="Enter your username"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                Description
              </label>
              <div className="relative group">
                <textarea
                  name="description"
                  rows="5"
                  value={localData.description}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl bg-gray-50/80 backdrop-blur-sm border-2 resize-none focus:outline-none focus:ring-4 focus:ring-[#3ABBD0]/20 transition-all duration-300 group-hover:border-[#3ABBD0]/50 ${
                    errors.description
                      ? "border-red-500"
                      : "border-[#3ABBD0]/30 focus:border-[#3ABBD0]"
                  }`}
                  placeholder="Enter description"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-[#263D5D] text-sm font-bold mb-1">
                <div className="w-2 h-2 bg-[#3ABBD0] rounded-full"></div>
                Phone
              </label>
              <div className="relative group">
                <div
                  className={`flex items-center border-2 rounded-2xl bg-gray-50/80 backdrop-blur-sm overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-[#3ABBD0]/20 group-hover:border-[#3ABBD0]/50 ${
                    errors.phone
                      ? "border-red-500"
                      : "border-[#3ABBD0]/30 focus-within:border-[#3ABBD0]"
                  }`}
                >
                  <span className="flex items-center gap-2 px-4 py-4 bg-white/90 border-r border-gray-300">
                    <img
                      src="https://flagcdn.com/w20/lk.png"
                      alt="Sri Lanka"
                      className="w-5 h-4"
                    />
                    +94
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={localData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-4 focus:outline-none bg-transparent"
                    placeholder="Enter your phone"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3ABBD0]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress * 100}%` }}
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
                onClick={handleSubmit}
                className="relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <span className="relative z-10">Next Page</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={categoriesBackground}
          alt="Modern house"
          className="object-cover w-full h-full opacity-100"
        />
        <div className="object-cover w-full h-full opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>
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

export default SetupYourAccountPage;
