import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createPost } from "../../firebase/dbService";
import {
  uploadMultipleCompressedImages,
  validateRequiredImages,
} from "../../firebase/storageService";
import postBackground from "../../assets/images/background/post-back.webp";
import man1Img from "../../assets/images/others/Img-6.webp";
import Modal from "../../components/Modal";

// Categories aligned with BrowsePlacePage
const CATEGORIES = [
  "Single Rooms",
  "Double Rooms",
  "Boarding Houses",
  "Hostels",
  "Sharing Rooms",
  "Annexes",
  "Houses",
  "Apartments",
];

// Districts aligned with BrowsePlacePage
const DISTRICTS = [
  { name: "Colombo", province: "Western" },
  { name: "Gampaha", province: "Western" },
  { name: "Kalutara", province: "Western" },
  { name: "Kandy", province: "Central" },
  { name: "Matale", province: "Central" },
  { name: "Nuwara Eliya", province: "Central" },
  { name: "Galle", province: "Southern" },
  { name: "Matara", province: "Southern" },
  { name: "Hambantota", province: "Southern" },
  { name: "Jaffna", province: "Northern" },
  { name: "Kilinochchi", province: "Northern" },
  { name: "Mannar", province: "Northern" },
  { name: "Vavuniya", province: "Northern" },
  { name: "Mullaitivu", province: "Northern" },
  { name: "Trincomalee", province: "Eastern" },
  { name: "Batticaloa", province: "Eastern" },
  { name: "Ampara", province: "Eastern" },
  { name: "Kurunegala", province: "North Western" },
  { name: "Puttalam", province: "North Western" },
  { name: "Anuradhapura", province: "North Central" },
  { name: "Polonnaruwa", province: "North Central" },
  { name: "Badulla", province: "Uva" },
  { name: "Monaragala", province: "Uva" },
  { name: "Ratnapura", province: "Sabaragamuwa" },
  { name: "Kegalle", province: "Sabaragamuwa" },
];

const PROVINCE_ORDER = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

// Step type (0, 1)
const steps = [
  {
    key: 0,
    label: "Details",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 1,
    label: "Finish",
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="m5 13 4 4L20 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const ArrowIcon = ({ dir = "right" }) => (
  <svg
    className={`w-5 h-5 ${dir === "left" ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SheenButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative overflow-hidden bg-[#263D5D] hover:bg-[#303435] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group flex items-center gap-3 justify-center ${
      disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
    } ${className}`}
  >
    <span className="relative z-10 flex items-center gap-3">{children}</span>
    {!disabled && (
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    )}
  </button>
);

const PillTag = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-sm">
    {children}
  </span>
);

const SectionTitle = ({ children, Icon }) => (
  <div className="flex items-center gap-3 mb-4">
    <Icon />
    <h3 className="font-hugiller text-2xl text-[#263D5D]">{children}</h3>
  </div>
);

const TextLabel = ({ children, className = "", required = false }) => (
  <label className={`font-semibold text-[#263D5D] ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const ErrorMessage = ({ message }) =>
  message ? (
    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <line
          x1="12"
          y1="8"
          x2="12"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="16"
          x2="12.01"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      {message}
    </div>
  ) : null;

const FormInput = ({ error, ...props }) => (
  <div>
    <input
      {...props}
      className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition ${
        error
          ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
      } ${props.className || ""}`}
    />
    <ErrorMessage message={error} />
  </div>
);

const FormSelect = ({ error, children, ...props }) => (
  <div>
    <div className="relative">
      <select
        {...props}
        className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition appearance-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
            : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
        }`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    <ErrorMessage message={error} />
  </div>
);

const FormTextarea = ({ error, ...props }) => (
  <div>
    <textarea
      {...props}
      className={`w-full bg-white border shadow-md rounded-2xl p-3 outline-none transition resize-none ${
        error
          ? "border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-400"
          : "border-slate-200/50 focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400"
      }`}
    />
    <ErrorMessage message={error} />
  </div>
);

const FormIcon = {
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  User: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="#263D5D"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const PostAddFormPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info",
    title: "",
    message: "",
    onClose: null,
  });
  const imageInputRef = useRef(null);

  // Helper function to show alert modal
  const showAlert = (type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  };

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    forWhom: "",
    location: "",
    description: "",
    rent: "",
    email: user?.email || "",
    mobile: "",
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  };

  const validateStep1 = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    // For Whom validation
    if (!formData.forWhom) {
      newErrors.forWhom = "Please select who this is for";
    }

    // Location validation
    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Rent validation
    if (!formData.rent.trim()) {
      newErrors.rent = "Rent amount is required";
    } else if (isNaN(Number(formData.rent.replace(/,/g, "")))) {
      newErrors.rent = "Please enter a valid number";
    } else if (Number(formData.rent.replace(/,/g, "")) <= 0) {
      newErrors.rent = "Rent must be greater than 0";
    } else if (Number(formData.rent.replace(/,/g, "")) > 1000000) {
      newErrors.rent = "Rent amount seems too high";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 9-digit mobile number";
    }

    // MANDATORY IMAGE VALIDATION
    if (uploadedImages.length === 0) {
      newErrors.images = "At least 1 property image is required";
    } else {
      const imageFiles = uploadedImages.map((img) => img.file);
      const imageValidation = validateRequiredImages(imageFiles, 1, 5);
      if (!imageValidation.isValid) {
        newErrors.images = imageValidation.errors.join(", ");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  // Image handling functions
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const addImages = (files) => {
    if (uploadedImages.length + files.length > 5) {
      showAlert(
        "warning",
        "Maximum Images Reached",
        "You can only upload a maximum of 5 images."
      );
      return;
    }

    const validation = validateRequiredImages(files, 1, 5);
    if (!validation.isValid) {
      showAlert(
        "error",
        "Image Validation Error",
        validation.errors.join("\n")
      );
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(2, 9),
    }));

    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const removeImage = (id) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const heroMan = useMemo(() => man1Img, []);

  const progressPercentage = useMemo(() => {
    let totalProgress = 0;

    // Step 1 (Details) progress
    const step1Fields = [
      formData.title.trim(),
      formData.category,
      formData.forWhom,
      formData.location,
      formData.description.trim(),
      formData.rent.trim(),
      formData.email.trim(),
      formData.mobile.trim(),
    ];
    const step1FilledCount = step1Fields.filter((field) => field !== "").length;
    const step1Progress = step1FilledCount / step1Fields.length;

    // Calculate total progress based on current step
    if (activeStep === 0) {
      totalProgress = step1Progress * 0.8;
    } else if (activeStep === 1) {
      totalProgress = 1.0;
    }

    return Math.round(totalProgress * 100);
  }, [formData, activeStep]);

  const goNext = () => {
    if (activeStep === 0 && !validateStep1()) {
      return;
    }
    setActiveStep((s) => Math.min(1, s + 1));
  };

  const handleSubmit = async () => {
    // Final validation before submission
    if (!validateStep1()) {
      showAlert(
        "error",
        "Validation Error",
        "Please fix all errors before submitting"
      );
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let imageUrls = [];

      // Upload images to Firebase Storage (MANDATORY)
      if (uploadedImages.length === 0) {
        throw new Error("At least 1 property image is required");
      }

      const imagesToUpload = uploadedImages.map((img) => img.file);
      const uploadResult = await uploadMultipleCompressedImages(
        imagesToUpload,
        "posts",
        {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8,
        },
        (progress) => {
          setUploadProgress(progress.percentage);
        }
      );

      if (uploadResult.errors.length > 0) {
        console.error("Some images failed to upload:", uploadResult.errors);
        showAlert(
          "warning",
          "Image Upload Warning",
          `${uploadResult.errors.length} image(s) failed to upload. Continuing with ${uploadResult.successCount} image(s).`
        );
      }

      // Get URLs from successful uploads (Firebase Storage returns direct URLs)
      imageUrls = uploadResult.success;

      // Create post data with image URLs
      const postData = {
        title: formData.title.trim(),
        category: formData.category,
        forWhom: formData.forWhom,
        location: formData.location,
        description: formData.description.trim(),
        rent: Number(formData.rent.replace(/,/g, "")),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        ownerId: user.uid,
        ownerName: userProfile?.fullName || "Anonymous",
        imageUrls: imageUrls, // Array of Firebase Storage image URLs
      };

      // Save to Firestore
      await createPost(postData);

      // Show success modal instead of alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting post:", error);
      showAlert(
        "error",
        "Submission Failed",
        "Failed to submit post: " + error.message
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/browse");
  };

  const canProceedToNext = () => {
    if (activeStep === 0) {
      return (
        formData.title &&
        formData.category &&
        formData.forWhom &&
        formData.location &&
        formData.description &&
        formData.rent &&
        formData.email &&
        formData.mobile
      );
    }
    return true;
  };

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src={postBackground}
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-white/0 to-white/0 backdrop-blur-[1px]"></div>
      </div>
      <div className="relative z-10 px-4 pt-10 pb-4 text-center">
        <h1 className="font-hugiller text-[52px] sm:text-[84px] md:text-[96px] lg:text-[106px] text-[#263D5D] leading-[1.1] animate-fadeInUp">
          Post Your <span className="text-[#3ABBD0] relative">Add</span>
        </h1>
        <p className="max-w-4xl mx-auto text-[#303435]/90 mt-4 font-montserrat text-lg sm:text-xl px-2">
          Discover the smarter way to rent - effortlessly list your boarding
          rooms, houses, hostels, or luxury apartments on our all-in-one
          platform.
        </p>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 min-h-[70vh]">
          {/* Stepper Section */}
          <div className="col-span-12 md:col-span-4 order-1 md:order-1">
            <div className="w-full max-w-[360px] mx-auto md:mx-0 rounded-3xl bg-white/85 backdrop-blur border border-white/60 shadow-2xl p-4 sm:p-5 animate-slideInLeft">
              <div className="space-y-3">
                {steps.map(({ key, label, Icon }) => {
                  const active = activeStep === key;
                  const hasErrors =
                    key === 0
                      ? Object.keys(errors).some((field) =>
                          [
                            "title",
                            "category",
                            "forWhom",
                            "location",
                            "description",
                            "rent",
                            "email",
                            "mobile",
                          ].includes(field)
                        )
                      : false;

                  return (
                    <button
                      key={label}
                      onClick={() => setActiveStep(key)}
                      className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-4 transition-all border ${
                        active
                          ? "bg-gradient-to-r from-cyan-400 to-sky-500 text-white border-transparent shadow-lg"
                          : hasErrors
                          ? "bg-red-50 text-red-700 border-red-200 shadow-sm hover:shadow-md"
                          : "bg-white text-[#263D5D] border-white shadow-sm hover:shadow-md"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${
                            active
                              ? "bg-white/20 text-white"
                              : hasErrors
                              ? "bg-red-100 text-red-600"
                              : "bg-cyan-50 text-sky-500"
                          }`}
                        >
                          {hasErrors ? (
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="12"
                                y1="8"
                                x2="12"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <line
                                x1="12"
                                y1="16"
                                x2="12.01"
                                y2="16"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          ) : (
                            <Icon />
                          )}
                        </span>
                        <span className="font-semibold">{label}</span>
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ArrowIcon />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Desktop Man Image */}
            <div className="hidden md:block relative mt-8 md:mt-10">
              <div className="relative max-w-[520px]">
                <img
                  src={heroMan}
                  alt="Illustration"
                  className="absolute left-[2px] max-w-[700px] h-auto mb-12 object-contain transform hover:scale-105 transition-transform duration-500 sm:w-auto drop-shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#3ABBD0]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-400/20 rounded-full blur-lg animate-bounce"></div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="col-span-12 md:col-span-8 order-2 md:order-2">
            <div className="rounded-3xl bg-white/90 backdrop-blur border border-white/70 shadow-2xl p-5 sm:p-7 md:p-8 min-h-[520px] animate-slideInRight">
              {/* STEP 0: DETAILS FORM */}
              {activeStep === 0 && (
                <div className="space-y-8">
                  <SectionTitle Icon={FormIcon.Edit}>
                    Create A Post
                  </SectionTitle>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Title
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormInput
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          error={errors.title}
                          placeholder="Enter a descriptive title (min 10 characters)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Category
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          error={errors.category}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        For Whom
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="forWhom"
                          value={formData.forWhom}
                          onChange={handleInputChange}
                          error={errors.forWhom}
                        >
                          <option value="" disabled>
                            Choose
                          </option>
                          <option>Students</option>
                          <option>Families</option>
                          <option>Professionals</option>
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Location
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormSelect
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          error={errors.location}
                        >
                          <option value="" disabled>
                            Select a district
                          </option>
                          {PROVINCE_ORDER.map((province) => {
                            const districtsInProvince = DISTRICTS.filter(
                              (d) => d.province === province
                            );
                            return (
                              <optgroup key={province} label={province}>
                                {districtsInProvince.map((district) => (
                                  <option
                                    key={district.name}
                                    value={district.name}
                                  >
                                    {district.name}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        </FormSelect>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <TextLabel
                        className="text-left md:col-span-1 pt-3"
                        required
                      >
                        Description
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormTextarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={5}
                          error={errors.description}
                          placeholder="Describe your property in detail (min 20 characters)"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Rent
                      </TextLabel>
                      <div className="md:col-span-3 relative flex items-center">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-14 bg-[#263D5D] text-white font-semibold rounded-xl">
                          Rs.
                        </span>
                        <FormInput
                          name="rent"
                          value={formData.rent}
                          onChange={handleInputChange}
                          className="pl-20"
                          error={errors.rent}
                          placeholder="Enter monthly rent"
                          type="number"
                        />
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <TextLabel
                        className="text-left md:col-span-1 pt-3"
                        required
                      >
                        Property Images
                      </TextLabel>
                      <div className="md:col-span-3 space-y-4">
                        {/* Upload Area */}
                        <div
                          className={`relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer bg-gray-50/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                            dragOver
                              ? "border-[#3ABBD0] bg-[#3ABBD0]/10"
                              : "border-[#3ABBD0]/40 hover:border-[#3ABBD0]/80"
                          }`}
                          onClick={() => imageInputRef.current.click()}
                          onDragOver={handleImageDragOver}
                          onDragLeave={handleImageDragLeave}
                          onDrop={handleImageDrop}
                        >
                          <input
                            ref={imageInputRef}
                            type="file"
                            onChange={handleImageSelect}
                            className="hidden"
                            accept="image/*"
                            multiple
                          />
                          <div className="text-center">
                            <div className="w-16 h-16 bg-[#263D5D]/10 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:bg-[#3ABBD0]/20 transition-colors duration-300">
                              <span className="text-[#263D5D] text-3xl group-hover:text-[#3ABBD0] transition-colors duration-300">
                                +
                              </span>
                            </div>
                            <p className="text-base font-medium text-[#263D5D] mb-1">
                              Upload Property Images{" "}
                              <span className="text-red-500">*</span>
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              Drag & drop or click to upload (min 1, max 5
                              images, 3MB each)
                            </p>
                            <p className="text-xs text-gray-400">
                              Formats: JPEG, PNG, WebP (Images will be
                              automatically compressed)
                            </p>
                          </div>
                        </div>

                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {uploadedImages.map((img) => (
                              <div
                                key={img.id}
                                className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                              >
                                <img
                                  src={img.preview}
                                  alt="Preview"
                                  className="w-full h-32 object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(img.id)}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-gray-500">
                          {uploadedImages.length} / 5 images uploaded
                          {uploadedImages.length === 0 && (
                            <span className="text-red-500 ml-2">
                              (At least 1 image required)
                            </span>
                          )}
                        </p>
                        {errors.images && (
                          <ErrorMessage message={errors.images} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <SectionTitle Icon={FormIcon.User}>
                      Owner Information
                    </SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Email
                      </TextLabel>
                      <div className="md:col-span-3">
                        <FormInput
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                          placeholder="your.email@example.com"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <TextLabel className="text-left md:col-span-1" required>
                        Mobile
                      </TextLabel>
                      <div className="md:col-span-3 relative flex items-center">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-16 bg-[#263D5D] text-white font-semibold rounded-xl">
                          +94
                        </span>
                        <FormInput
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className="pl-20"
                          error={errors.mobile}
                          placeholder="771234567"
                          maxLength={9}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center pt-4">
                    <SheenButton
                      onClick={goNext}
                      className="min-w-[160px]"
                      disabled={!canProceedToNext()}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white">
                        <ArrowIcon />
                      </span>
                      Next
                    </SheenButton>
                  </div>
                </div>
              )}

              {/* STEP 1: FINISH/PREVIEW */}
              {activeStep === 1 && (
                <div className="space-y-8">
                  <div className="rounded-3xl bg-white/90 border border-white/70 shadow-xl p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-hugiller text-2xl text-[#263D5D]">
                            {formData.title || "[No Title]"}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {formData.category && (
                              <PillTag>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M3 11l9-7 9 7v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z"
                                    stroke="#475569"
                                    strokeWidth="2"
                                  />
                                </svg>
                                {formData.category}
                              </PillTag>
                            )}
                            {formData.location && (
                              <PillTag>
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    d="M12 21s7-6.5 7-11a7 7 0 0 0-14 0c0 4.5 7 11 7 11Z"
                                    stroke="#475569"
                                    strokeWidth="2"
                                  />
                                </svg>
                                {formData.location}
                              </PillTag>
                            )}
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-sm text-slate-500">Rent</div>
                          <div className="text-2xl font-bold text-[#263D5D]">
                            {formData.rent
                              ? `RS. ${formData.rent}`
                              : "[No Rent]"}
                          </div>
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden">
                        {uploadedImages.length > 0 ? (
                          <div className="relative">
                            <img
                              src={uploadedImages[0].preview}
                              alt="Property Preview"
                              className="w-full h-64 sm:h-80 object-cover"
                            />
                            {uploadedImages.length > 1 && (
                              <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                                {uploadedImages.length} photos
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <svg
                                className="w-16 h-16 mx-auto mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-sm">No images uploaded</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            <h3 className="font-hugiller text-2xl text-[#263D5D]">
                              Details
                            </h3>
                          </div>
                          <div className="text-sm text-slate-600 space-y-2 pl-2">
                            {formData.forWhom && (
                              <div>
                                <strong>For Whom:</strong> {formData.forWhom}
                              </div>
                            )}
                            {formData.description && (
                              <div>
                                <strong>Description:</strong>{" "}
                                {formData.description}
                              </div>
                            )}
                            {formData.email && (
                              <div>
                                <strong>Contact:</strong> {formData.email}
                              </div>
                            )}
                            {formData.mobile && (
                              <div>
                                <strong>Mobile:</strong> +94 {formData.mobile}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-end justify-start sm:justify-end">
                          <SheenButton
                            onClick={() => setActiveStep(0)}
                            className="min-w-[160px] bg-[#303435]"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 20h9"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M16.5 3.5a2.121 2.121 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Edit Details
                          </SheenButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final validation summary */}
                  {Object.keys(errors).length > 0 && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <line
                            x1="12"
                            y1="16"
                            x2="12.01"
                            y2="16"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                        Please fix the following issues:
                      </div>
                      <ul className="text-sm text-red-600 space-y-1">
                        {Object.entries(errors).map(
                          ([field, message]) =>
                            message && (
                              <li
                                key={field}
                                className="flex items-center gap-2"
                              >
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {message}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isSubmitting && uploadProgress > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Uploading images...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#3ABBD0] to-cyan-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center">
                    <SheenButton
                      onClick={handleSubmit}
                      className="min-w-[160px]"
                      disabled={Object.keys(errors).length > 0 || isSubmitting}
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500 text-white">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="m5 13 4 4L20 6"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {isSubmitting ? "Submitting..." : "Submit Post"}
                    </SheenButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Man Image */}
        <div className="block md:hidden mt-8">
          <div className="relative flex justify-center">
            <div className="relative max-w-[650px] w-full translate-x-6">
              <img
                src={heroMan}
                alt="Illustration"
                className="w-[1900px] h-auto object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Post Submitted Successfully!"
        size="md"
        showCloseButton={false}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-green-500"
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
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#263D5D] mb-3">
              Thank You for Your Submission!
            </h3>
            <p className="text-gray-600 mb-2">
              Your post is being reviewed by our team and will be available
              soon.
            </p>
            <p className="text-sm text-gray-500">
              We'll notify you once your post is approved and live on the
              platform.
            </p>
          </div>

          <button
            onClick={handleModalClose}
            className="w-full px-6 py-3 bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white rounded-xl font-semibold transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </Modal>

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
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostAddFormPage;
