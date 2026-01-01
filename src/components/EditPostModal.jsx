import { useState, useEffect, useRef } from "react";
import { editPost } from "../firebase/dbService";
import {
  uploadMultipleCompressedImages,
  validateRequiredImages,
} from "../firebase/storageService";
import Modal from "./Modal";

const EditPostModal = ({ isOpen, onClose, post, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    forWhom: "",
    location: "",
    description: "",
    rent: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const imageInputRef = useRef(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info", // 'error', 'warning', 'success', 'info'
    title: "",
    message: "",
    onClose: null,
  });

  // Categories and districts (same as PostAddFormPage)
  const CATEGORIES = [
    "Single Rooms",
    "Double Rooms",
    "Boarding Houses",
    "Hostels",
    "Sharing Rooms",
    "Annexes",
    "Houses",
    "Apartments",
    "Single Bedrooms",
  ];

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

  // Helper function to show alert modal
  const showAlert = (type, title, message, onClose = null) => {
    setAlertConfig({ type, title, message, onClose });
    setShowAlertModal(true);
  };

  // Initialize form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        category: post.category || "",
        forWhom: post.forWhom || "",
        location: post.location || "",
        description: post.description || "",
        rent: post.rent ? post.rent.toString() : "",
        email: post.email || "",
        mobile: post.mobile || "",
      });
      setUploadedImages([]);
      setErrors({});
    }
  }, [post]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ""));
  };

  const validateForm = () => {
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

    const validation = validateImages(files);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls = [];

      // Upload new images if any
      if (uploadedImages.length > 0) {
        const imagesToUpload = uploadedImages.map((img) => img.file);
        const uploadResult = await uploadMultipleImages(
          imagesToUpload,
          "posts"
        );

        if (uploadResult.errors.length > 0) {
          console.error("Some images failed to upload:", uploadResult.errors);
          showAlert(
            "warning",
            "Image Upload Warning",
            `${uploadResult.errors.length} image(s) failed to upload. Continuing with ${uploadResult.successCount} image(s).`
          );
        }

        imageUrls = uploadResult.success;
      }

      // Prepare updated data
      const updatedData = {
        title: formData.title.trim(),
        category: formData.category,
        forWhom: formData.forWhom,
        location: formData.location,
        description: formData.description.trim(),
        rent: Number(formData.rent.replace(/,/g, "")),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
      };

      // Add new images to existing ones if any
      if (imageUrls.length > 0) {
        updatedData.imageUrls = [...(post.imageUrls || []), ...imageUrls];
      }

      // Update the post
      await editPost(post.id, updatedData);

      // Show success message for resubmitted declined posts
      if (post.status === "declined") {
        showAlert(
          "success",
          "Post Resubmitted Successfully!",
          "Your post has been successfully resubmitted for review.",
          () => {
            onSuccess();
            onClose();
          }
        );
      } else {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showAlert(
        "error",
        "Update Failed",
        "Failed to update post: " + error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#263D5D]">Edit Post</h2>
              {post.status === "declined" && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    Previously Declined
                  </div>
                  <span className="text-sm text-gray-600">
                    This post will be resubmitted for review after editing
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-300 focus:ring-[#3ABBD0]"
                }`}
                placeholder="Enter a descriptive title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category and For Whom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.category
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-300 focus:ring-[#3ABBD0]"
                  }`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                  For Whom <span className="text-red-500">*</span>
                </label>
                <select
                  name="forWhom"
                  value={formData.forWhom}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.forWhom
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-300 focus:ring-[#3ABBD0]"
                  }`}
                >
                  <option value="">Choose</option>
                  <option value="Students">Students</option>
                  <option value="Families">Families</option>
                  <option value="Professionals">Professionals</option>
                </select>
                {errors.forWhom && (
                  <p className="text-red-500 text-sm mt-1">{errors.forWhom}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.location
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-300 focus:ring-[#3ABBD0]"
                }`}
              >
                <option value="">Select a district</option>
                {PROVINCE_ORDER.map((province) => {
                  const districtsInProvince = DISTRICTS.filter(
                    (d) => d.province === province
                  );
                  return (
                    <optgroup key={province} label={province}>
                      {districtsInProvince.map((district) => (
                        <option key={district.name} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
                  errors.description
                    ? "border-red-300 focus:ring-red-300"
                    : "border-gray-300 focus:ring-[#3ABBD0]"
                }`}
                placeholder="Describe your property in detail"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Rent */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Rent <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rs.
                </span>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className={`w-full pl-12 p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.rent
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-300 focus:ring-[#3ABBD0]"
                  }`}
                  placeholder="Enter monthly rent"
                />
              </div>
              {errors.rent && (
                <p className="text-red-500 text-sm mt-1">{errors.rent}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                Add More Images
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-[#3ABBD0] bg-[#3ABBD0]/10"
                    : "border-gray-300 hover:border-[#3ABBD0]"
                }`}
                onClick={() => imageInputRef.current?.click()}
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
                <div className="text-4xl text-gray-400 mb-2">+</div>
                <p className="text-gray-600">Click or drag to add images</p>
                <p className="text-sm text-gray-500">Max 5 images, 3MB each</p>
              </div>

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-300 focus:ring-[#3ABBD0]"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#263D5D] mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    +94
                  </span>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={9}
                    className={`w-full pl-12 p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? "border-red-300 focus:ring-red-300"
                        : "border-gray-300 focus:ring-[#3ABBD0]"
                    }`}
                    placeholder="771234567"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? post.status === "declined"
                    ? "Resubmitting..."
                    : "Updating..."
                  : post.status === "declined"
                  ? "Resubmit for Review"
                  : "Update Post"}
              </button>
            </div>
          </form>
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
    </div>
  );
};

export default EditPostModal;
