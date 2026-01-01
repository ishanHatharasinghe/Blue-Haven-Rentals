import { useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { useSignup } from "../../context/SignupContext";
import { signup } from "../../firebase/authService";
import { createUserProfile } from "../../firebase/dbService";
import {
  uploadCompressedImage,
} from "../../firebase/storageService";
import { useNavigate } from "react-router-dom";
import heroBackground from "../../assets/images/background/hero-background.webp";

const SetupYourImagePage = () => {
  const { formData, updateFormData, prevStep, resetSignup } =
    useSignup();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(
    formData.profileImage || null
  );
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ref for hidden file input
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Validate required images
      if (!profileImage) {
        setError("Profile image is required");
        setLoading(false);
        return;
      }

      if (!formData.frontImage || !formData.backImage) {
        setError("Both front and back ID images are required");
        setLoading(false);
        return;
      }

      // 1. Create Firebase Authentication user
      const userCredential = await signup(formData.email, formData.password);
      const user = userCredential.user;

      // 2. Upload images to Firebase Storage (MANDATORY)
      const profileImageUrl = await uploadCompressedImage(
        profileImage,
        `profiles/${user.uid}`,
        {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8,
        }
      );

      const idFrontImageUrl = await uploadCompressedImage(
        formData.frontImage,
        `id-documents/${user.uid}`,
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.9,
        }
      );

      const idBackImageUrl = await uploadCompressedImage(
        formData.backImage,
        `id-documents/${user.uid}`,
        {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.9,
        }
      );

      // 3. Create user profile in Firestore
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        username: formData.username,
        description: formData.description,
        phone: formData.phone,
        country: formData.country,
        district: formData.district,
        division: formData.division,
        postalCode: formData.postalCode,
        idNumber: formData.idNumber,
        profileImageUrl: profileImageUrl,
        idFrontImageUrl: idFrontImageUrl,
        idBackImageUrl: idBackImageUrl,
        userType: formData.userType,
      });

      // 4. Update local form data and move to success page
      updateFormData({ profileImage });

      // Clear local storage after successful signup
      resetSignup();

      // Move to completion page
      navigate("/signup/complete");
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific error cases
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(
          error.message || "Failed to create account. Please try again."
        );
      }

      setLoading(false);
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

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 px-4 md:px-10 relative z-10">
          {/* Left Side */}
          <div className="flex-1 max-w-lg text-center lg:text-left">
            <div className="animate-fadeInUp">
              <h1 className="font-hugiller text-[60px] sm:text-[90px] md:text-[100px] lg:text-[110px] text-[#263D5D] leading-[1.1] mb-4">
                Setup your <br />
                <span className="text-[#3ABBD0] relative">Profile</span>
              </h1>
              <p className="font-hugiller text-lg md:text-xl text-[#303435] mb-6 opacity-80">
                Upload your profile image
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 w-full lg:w-[600px] relative z-20 border border-white/30 animate-slideInRight">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              {/* Upload Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#263D5D] mb-2">
                  Upload Your Profile Image
                </h2>
                <p className="text-sm text-gray-600">
                  maximum allowed upload size of 3 MB
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl">
                  {error}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="mb-8 flex justify-center">
                <div
                  className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-3xl w-80 h-80 cursor-pointer bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    dragOver
                      ? "border-[#3ABBD0] bg-[#3ABBD0]/10"
                      : "border-[#3ABBD0]/40 hover:border-[#3ABBD0]/80"
                  }`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />

                  {profileImage ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#3ABBD0] rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-white text-3xl">✓</span>
                      </div>
                      <p className="text-sm font-medium text-[#263D5D] mb-2">
                        {profileImage.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to change image
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-[#263D5D]/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-[#3ABBD0]/20 transition-colors duration-300">
                        <span className="text-[#263D5D] text-4xl group-hover:text-[#3ABBD0] transition-colors duration-300">
                          +
                        </span>
                      </div>
                      <p className="text-lg font-medium text-[#263D5D] mb-2">
                        Upload Your Profile Image
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to upload, or skip to continue
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{profileImage ? "100" : "0"}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${profileImage ? "100" : "0"}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="relative overflow-hidden bg-[#3ABBD0] hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">Previous</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {loading ? "Creating Account..." : "Complete Signup"}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
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

export default SetupYourImagePage;
