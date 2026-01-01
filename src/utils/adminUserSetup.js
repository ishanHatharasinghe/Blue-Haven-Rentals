import { signup } from "../firebase/authService";
import { createUserProfile } from "../firebase/dbService";
import { getUserProfile } from "../firebase/dbService";

// Admin test user credentials
const ADMIN_USER_EMAIL = "admin@bluerental.com";
const ADMIN_USER_PASSWORD = "Admin@123";

// Boarding owner test user credentials
const OWNER_USER_EMAIL = "owner@bluerental.com";
const OWNER_USER_PASSWORD = "Owner@123";

/**
 * Initialize admin test user for development and testing
 * This creates an admin user with full access to all features
 */
export const initializeAdminUser = async () => {
  // Check if we've already attempted to create the admin user in this session
  const adminUserInitialized = sessionStorage.getItem("adminUserInitialized");

  if (adminUserInitialized === "true") {
    console.log("ℹ️ Admin user already initialized in this session");
    return;
  }

  try {
    // Try to create the admin user
    const userCredential = await signup(ADMIN_USER_EMAIL, ADMIN_USER_PASSWORD);
    const user = userCredential.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      // Create admin user profile in Firestore
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: ADMIN_USER_EMAIL,
        firstName: "Admin",
        lastName: "User",
        fullName: "Admin User",
        username: "adminuser",
        description:
          "System administrator account with full access to all features.",
        phone: "0771234567",
        country: "Sri Lanka",
        district: "Colombo",
        division: "Colombo 3",
        postalCode: "00300",
        idNumber: "ADMIN123456789",
        profileImageUrl: "",
        idFrontImageUrl: "",
        idBackImageUrl: "",
        role: "admin", // Admin role
        userType: "admin", // Admin user type
      });

      console.log("✅ Admin user created successfully");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 Email:", ADMIN_USER_EMAIL);
      console.log("🔑 Password:", ADMIN_USER_PASSWORD);
      console.log("👤 Role: admin");
      console.log("🎯 Access: Unrestricted (all features)");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      console.log("ℹ️ Admin user profile already exists");
    }

    // Mark as initialized for this session
    sessionStorage.setItem("adminUserInitialized", "true");
  } catch (error) {
    // User might already exist, which is fine
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Admin user already exists in the system");
      sessionStorage.setItem("adminUserInitialized", "true");
    } else {
      console.error("❌ Error initializing admin user:", error.message);
    }
  }
};

/**
 * Initialize boarding owner test user for development and testing
 * This creates a boarding owner user who can create posts
 */
export const initializeBoardingOwnerUser = async () => {
  // Check if we've already attempted to create the owner user in this session
  const ownerUserInitialized = sessionStorage.getItem("ownerUserInitialized");

  if (ownerUserInitialized === "true") {
    console.log("ℹ️ Boarding owner user already initialized in this session");
    return;
  }

  try {
    // Try to create the boarding owner user
    const userCredential = await signup(OWNER_USER_EMAIL, OWNER_USER_PASSWORD);
    const user = userCredential.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      // Create boarding owner user profile in Firestore
      await createUserProfile(user.uid, {
        uid: user.uid,
        email: OWNER_USER_EMAIL,
        firstName: "Property",
        lastName: "Owner",
        fullName: "Property Owner",
        username: "propertyowner",
        description: "Boarding house owner account for testing post creation.",
        phone: "0779876543",
        country: "Sri Lanka",
        district: "Kandy",
        division: "Kandy City",
        postalCode: "20000",
        idNumber: "OWNER987654321",
        profileImageUrl: "",
        idFrontImageUrl: "",
        idBackImageUrl: "",
        role: "boarding_owner", // Boarding owner role
        userType: "boarding_owner", // Boarding owner user type
      });

      console.log("✅ Boarding owner user created successfully");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 Email:", OWNER_USER_EMAIL);
      console.log("🔑 Password:", OWNER_USER_PASSWORD);
      console.log("👤 Role: boarding_owner");
      console.log("🎯 Access: Can create and manage posts");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } else {
      console.log("ℹ️ Boarding owner user profile already exists");
    }

    // Mark as initialized for this session
    sessionStorage.setItem("ownerUserInitialized", "true");
  } catch (error) {
    // User might already exist, which is fine
    if (error.code === "auth/email-already-in-use") {
      console.log("ℹ️ Boarding owner user already exists in the system");
      sessionStorage.setItem("ownerUserInitialized", "true");
    } else {
      console.error(
        "❌ Error initializing boarding owner user:",
        error.message
      );
    }
  }
};

/**
 * Initialize all test users at once
 */
export const initializeAllTestUsers = async () => {
  console.log("🚀 Initializing test users...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await initializeAdminUser();
  await initializeBoardingOwnerUser();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Test user initialization complete");
  console.log("\n💡 Quick Login:");
  console.log("   Admin: admin@bluerental.com / Admin@123");
  console.log("   Owner: owner@bluerental.com / Owner@123");
};

// Export test user credentials for easy reference
export const TEST_USERS = {
  admin: {
    email: ADMIN_USER_EMAIL,
    password: ADMIN_USER_PASSWORD,
    role: "admin",
    description: "Full access to all features",
  },
  boardingOwner: {
    email: OWNER_USER_EMAIL,
    password: OWNER_USER_PASSWORD,
    role: "boarding_owner",
    description: "Can create and manage posts",
  },
};

// Convenience function to log test user credentials
export const logTestUserCredentials = () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 TEST USER CREDENTIALS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n👑 ADMIN USER:");
  console.log("   Email:", TEST_USERS.admin.email);
  console.log("   Password:", TEST_USERS.admin.password);
  console.log("   Role:", TEST_USERS.admin.role);
  console.log("   Access:", TEST_USERS.admin.description);
  console.log("\n🏠 BOARDING OWNER USER:");
  console.log("   Email:", TEST_USERS.boardingOwner.email);
  console.log("   Password:", TEST_USERS.boardingOwner.password);
  console.log("   Role:", TEST_USERS.boardingOwner.role);
  console.log("   Access:", TEST_USERS.boardingOwner.description);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
};
