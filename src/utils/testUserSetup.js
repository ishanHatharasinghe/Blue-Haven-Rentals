import { signup } from "../firebase/authService";
import { createUserProfile } from "../firebase/dbService";
import { getUserProfile } from "../firebase/dbService";

const TEST_USER_EMAIL = "test@gmail.com";
const TEST_USER_PASSWORD = "test@123";

export const initializeTestUser = async () => {
  // Check if we've already attempted to create the test user in this session
  const testUserInitialized = sessionStorage.getItem("testUserInitialized");

  if (testUserInitialized === "true") {
    return;
  }

  try {
    // Try to create the test user
    const userCredential = await signup(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    const user = userCredential.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      // Create test user profile in Firestore
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: TEST_USER_EMAIL,
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        description: "This is a test user account for development purposes.",
        phone: "1234567890",
        country: "Sri Lanka",
        district: "Colombo",
        division: "Colombo 7",
        postalCode: "00700",
        idNumber: "TEST123456789",
        profileImageUrl: "",
        idFrontImageUrl: "",
        idBackImageUrl: "",
      });

      console.log("✅ Test user created successfully");
      console.log("Email:", TEST_USER_EMAIL);
      console.log("Password:", TEST_USER_PASSWORD);
    }

    // Mark as initialized for this session
    sessionStorage.setItem("testUserInitialized", "true");
  } catch (error) {
    // User might already exist, which is fine
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Test user already exists");
      sessionStorage.setItem("testUserInitialized", "true");
    } else {
      console.error("Error initializing test user:", error.message);
    }
  }
};

// Export test user credentials for easy reference
export const TEST_USER_CREDENTIALS = {
  email: TEST_USER_EMAIL,
  password: TEST_USER_PASSWORD,
};
