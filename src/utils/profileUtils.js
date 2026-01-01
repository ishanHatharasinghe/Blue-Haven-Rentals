/**
 * Utility functions for user profile display
 */

/**
 * Generates user initials from firstName and lastName
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} Uppercase initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last;
};

/**
 * Gets the full name from firstName and lastName fields
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} fallback - Fallback text if no names available (default: "User")
 * @returns {string} Full name or fallback
 */
export const getFullName = (firstName, lastName, fallback = "User") => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : fallback;
};

/**
 * Gets the display name for a user, handling various name field combinations
 * @param {Object} userProfile - User profile object
 * @param {string} fallback - Fallback text if no name available (default: "User")
 * @returns {string} Display name
 */
export const getDisplayName = (userProfile, fallback = "User") => {
  if (!userProfile) return fallback;

  // Try fullName first (for backward compatibility)
  if (userProfile.fullName) {
    return userProfile.fullName;
  }

  // Try firstName + lastName combination
  if (userProfile.firstName || userProfile.lastName) {
    return getFullName(userProfile.firstName, userProfile.lastName, fallback);
  }

  // Try username as fallback
  if (userProfile.username) {
    return userProfile.username;
  }

  return fallback;
};

/**
 * Gets profile image URL, checking multiple possible field names
 * @param {Object} userProfile - User profile object
 * @returns {string|null} Profile image URL or null
 */
export const getProfileImageUrl = (userProfile) => {
  if (!userProfile) return null;

  return userProfile.profileImageUrl || userProfile.profileImage || null;
};

/**
 * Determines if a profile image is available
 * @param {Object} userProfile - User profile object
 * @returns {boolean} True if profile image is available
 */
export const hasProfileImage = (userProfile) => {
  const imageUrl = getProfileImageUrl(userProfile);
  return imageUrl && imageUrl.trim() !== "";
};
