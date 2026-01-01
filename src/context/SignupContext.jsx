import { createContext, useContext, useState, useEffect } from "react";

const SignupContext = createContext();

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within SignupProvider");
  }
  return context;
};

export const SignupProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - User Type Selection
    userType: "", // boarding_finder, boarding_owner

    // Step 2 - Basic Info
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Step 3 - Account Details (boarding_owner only)
    username: "",
    description: "",
    phone: "",

    // Step 4 - Location (boarding_owner only)
    country: "",
    district: "",
    division: "",
    postalCode: "",

    // Step 5 - ID Verification (boarding_owner only)
    idNumber: "",
    frontImage: null,
    backImage: null,

    // Step 6 - Profile Image (boarding_owner only)
    profileImage: null,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("signupFormData");
    const savedStep = localStorage.getItem("signupCurrentStep");

    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved signup data:", error);
      }
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("signupFormData", JSON.stringify(formData));
    localStorage.setItem("signupCurrentStep", currentStep.toString());
  }, [formData, currentStep]);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    // For boarding_finder: skip steps 3-6 (account details, location, ID verification, profile image)
    if (formData.userType === "boarding_finder" && currentStep === 2) {
      // After step 2 (basic info), go directly to completion
      setCurrentStep(7); // Step 7 will be the completion page
    } else if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  const resetSignup = () => {
    setFormData({
      userType: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      description: "",
      phone: "",
      country: "",
      district: "",
      division: "",
      postalCode: "",
      idNumber: "",
      frontImage: null,
      backImage: null,
      profileImage: null,
    });
    setCurrentStep(1);
    localStorage.removeItem("signupFormData");
    localStorage.removeItem("signupCurrentStep");
  };

  const value = {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetSignup,
  };

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
};
