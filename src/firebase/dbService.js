import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { deleteUser as deleteAuthUser } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { deleteImage, listImagesInFolder } from "./storageService";

// CREATE
export const addPlace = async (placeData) => {
  const colRef = collection(db, "places");
  return await addDoc(colRef, placeData);
};

// READ
export const getPlaces = async () => {
  const colRef = collection(db, "places");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// UPDATE
export const updatePlace = async (id, updatedData) => {
  const docRef = doc(db, "places", id);
  return await updateDoc(docRef, updatedData);
};

// DELETE
export const deletePlace = async (id) => {
  const docRef = doc(db, "places", id);
  return await deleteDoc(docRef);
};

// POST OPERATIONS

// Create a new post
export const createPost = async (postData) => {
  const colRef = collection(db, "posts");
  const docRef = await addDoc(colRef, {
    ...postData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending", // pending, approved, declined, active (default to pending for review)
  });
  return docRef;
};

// Get all posts
export const getPosts = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get posts by location
export const getPostsByLocation = async (location) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.location === location);
};

// Get posts by category
export const getPostsByCategory = async (category) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.category === category);
};

// Get posts by owner
export const getPostsByOwner = async (ownerId) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.ownerId === ownerId);
};

// Get single post by ID
export const getPost = async (id) => {
  const docRef = doc(db, "posts", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update a post
export const updatePost = async (id, updatedData) => {
  const docRef = doc(db, "posts", id);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};

// Edit a post (handles status transitions)
export const editPost = async (id, updatedData) => {
  const docRef = doc(db, "posts", id);
  const postDoc = await getDoc(docRef);

  if (!postDoc.exists()) {
    throw new Error("Post not found");
  }

  const currentPost = postDoc.data();

  // Determine new status based on current status
  let newStatus = currentPost.status;
  let updateData = {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };

  // If the post was approved and is being edited, change status to pending
  if (currentPost.status === "approved") {
    newStatus = "pending";
    updateData.status = newStatus;
    updateData.editedAt = new Date().toISOString();
    updateData.isEdited = true;
  }
  // If the post was declined and is being edited, change status to pending and clear decline data
  else if (currentPost.status === "declined") {
    newStatus = "pending";
    updateData.status = newStatus;
    updateData.editedAt = new Date().toISOString();
    updateData.isEdited = true;
    updateData.declineReason = null;
    updateData.declinedAt = null;
    updateData.resubmittedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updateData);

  return { id, ...updatedData, status: newStatus };
};

// Delete a post with complete image cleanup
export const deletePost = async (id) => {
  try {
    // First, get the post data to access image URLs
    const postRef = doc(db, "posts", id);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }
    
    const postData = postDoc.data();
    
    // Delete all associated images from Firebase Storage
    if (postData.imageUrls && Array.isArray(postData.imageUrls)) {
      const { deleteImage } = await import('./storageService.js');
      
      for (const imageUrl of postData.imageUrls) {
        try {
          // Extract path from URL and delete
          const urlParts = imageUrl.split('/');
          const pathIndex = urlParts.findIndex(part => part === 'posts');
          if (pathIndex !== -1) {
            const imagePath = urlParts.slice(pathIndex).join('/');
            await deleteImage(imagePath);
            console.log(`Successfully deleted image: ${imagePath}`);
          }
        } catch (error) {
          console.warn(`Failed to delete post image: ${error.message}`);
          // Continue with other images even if one fails
        }
      }
    }
    
    // Delete the post document from Firestore
    await deleteDoc(postRef);
    console.log(`Successfully deleted post: ${id}`);
    
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

// USER PROFILE OPERATIONS

// Create user profile with specific UID
export const createUserProfile = async (uid, userData) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...userData,
    userType: userData.userType || "boarding_finder", // Store user type (boarding_finder or boarding_owner)
    role: userData.userType || userData.role || "boarding_finder", // Also store as role for backwards compatibility
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return userRef;
};

// Get user profile by UID
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update user profile
export const updateUserProfile = async (uid, updatedData) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
};

// Get all users
export const getAllUsers = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Comprehensive user deletion with complete data cleanup
export const deleteUser = async (uid) => {
  const deletionResults = {
    userDocument: false,
    profileImages: false,
    idDocuments: false,
    userPosts: false,
    authAccount: false,
    errors: []
  };

  try {
    // Step 1: Get user data before deletion to identify all associated files
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    const filesToDelete = [];

    // Collect all storage paths associated with the user
    if (userData.profileImageUrl) {
      // Extract path from URL - profile images are stored in "profiles/{userId}/" folder
      filesToDelete.push(`profiles/${uid}`);
    }

    if (userData.idFrontImageUrl || userData.idBackImageUrl) {
      // ID documents are stored in "id-documents/{userId}/" folder
      filesToDelete.push(`id-documents/${uid}`);
    }

    // Step 2: Get and delete all user posts and their associated images
    try {
      const userPosts = await getPostsByOwner(uid);
      
      for (const post of userPosts) {
        // Delete post images from storage
        if (post.imageUrls && Array.isArray(post.imageUrls)) {
          for (const imageUrl of post.imageUrls) {
            try {
              // Extract path from URL and delete
              const urlParts = imageUrl.split('/');
              const pathIndex = urlParts.findIndex(part => part === 'posts');
              if (pathIndex !== -1) {
                const imagePath = urlParts.slice(pathIndex).join('/');
                await deleteImage(imagePath);
              }
            } catch (error) {
              console.warn(`Failed to delete post image: ${error.message}`);
              deletionResults.errors.push(`Post image deletion failed: ${error.message}`);
            }
          }
        }
        
        // Delete the post document
        await deletePost(post.id);
      }
      deletionResults.userPosts = true;
    } catch (error) {
      console.error("Error deleting user posts:", error);
      deletionResults.errors.push(`User posts deletion failed: ${error.message}`);
    }

    // Step 3: Delete all user images from Firebase Storage
    for (const folderPath of filesToDelete) {
      try {
        // List all images in the folder
        const images = await listImagesInFolder(folderPath);
        
        // Delete each image
        for (const image of images) {
          try {
            await deleteImage(image.path);
          } catch (error) {
            console.warn(`Failed to delete image ${image.name}: ${error.message}`);
            deletionResults.errors.push(`Image deletion failed (${image.name}): ${error.message}`);
          }
        }
        
        if (folderPath.includes('profiles')) {
          deletionResults.profileImages = true;
        }
        if (folderPath.includes('id-documents')) {
          deletionResults.idDocuments = true;
        }
      } catch (error) {
        console.error(`Error deleting images from ${folderPath}:`, error);
        deletionResults.errors.push(`Storage cleanup failed (${folderPath}): ${error.message}`);
      }
    }

    // Step 4: Delete user document from Firestore
    try {
      await deleteDoc(userRef);
      deletionResults.userDocument = true;
    } catch (error) {
      console.error("Error deleting user document:", error);
      deletionResults.errors.push(`User document deletion failed: ${error.message}`);
      throw error; // Re-throw to prevent auth deletion if document deletion fails
    }

    // Step 5: Delete user from Firebase Authentication
    try {
      // Note: This requires admin privileges. In a real app, this should be done server-side
      // For now, we'll mark it as attempted but may not work in client-side
      try {
        const user = auth.currentUser;
        if (user && user.uid === uid) {
          await deleteAuthUser(user);
        }
        deletionResults.authAccount = true;
      } catch (authError) {
        console.warn("Auth deletion failed (requires server-side implementation):", authError);
        deletionResults.errors.push(`Auth account deletion failed: ${authError.message}`);
        // Don't throw here as the main user data is already deleted
      }
    } catch (error) {
      console.error("Error deleting auth account:", error);
      deletionResults.errors.push(`Auth account deletion failed: ${error.message}`);
    }

    // Check if critical operations succeeded
    if (!deletionResults.userDocument) {
      throw new Error("Failed to delete user document - critical operation failed");
    }

    return deletionResults;

  } catch (error) {
    console.error("Comprehensive user deletion failed:", error);
    deletionResults.errors.push(`Comprehensive deletion failed: ${error.message}`);
    throw error;
  }
};

// ADMIN-SPECIFIC FUNCTIONS

// Get posts by status (pending, approved, declined)
export const getPostsByStatus = async (status) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter((post) => post.status === status);
};

// Get declined posts by owner
export const getDeclinedPostsByOwner = async (ownerId) => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter(
    (post) => post.ownerId === ownerId && post.status === "declined"
  );
};

// Get edited posts that need re-approval
export const getEditedPosts = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return posts.filter(
    (post) => post.isEdited === true && post.status === "pending"
  );
};

// Update post status
export const updatePostStatus = async (
  postId,
  status,
  declineReason = null
) => {
  const docRef = doc(db, "posts", postId);
  const updateData = {
    status: status,
    updatedAt: new Date().toISOString(),
  };

  // If approving a post, clear the edited flag
  if (status === "approved") {
    updateData.isEdited = false;
    updateData.editedAt = null;
  }

  // If declining a post, add decline reason and timestamp
  if (status === "declined") {
    updateData.declineReason = declineReason;
    updateData.declinedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updateData);
};

// Get user statistics
export const getUserStatistics = async () => {
  const colRef = collection(db, "users");
  const snapshot = await getDocs(colRef);
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Filter out admin users from total count
  const nonAdminUsers = users.filter((u) => u.role !== "admin");

  const stats = {
    totalUsers: nonAdminUsers.length, // Exclude admins from total count
    boardingOwners: users.filter(
      (u) => u.role !== "admin" && (u.role === "boarding_owner" || u.userType === "boarding_owner")
    ).length,
    boardingFinders: users.filter(
      (u) => u.role !== "admin" && (u.role === "boarding_finder" || u.userType === "boarding_finder")
    ).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  return stats;
};

// Get post statistics
export const getPostStatistics = async () => {
  const colRef = collection(db, "posts");
  const snapshot = await getDocs(colRef);
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const stats = {
    totalPosts: posts.length,
    pendingPosts: posts.filter((p) => p.status === "pending").length,
    approvedPosts: posts.filter((p) => p.status === "approved").length,
    declinedPosts: posts.filter((p) => p.status === "declined").length,
    activePosts: posts.filter((p) => p.status === "active").length,
  };

  return stats;
};

// Get analytics data
export const getAnalyticsData = async () => {
  const postsColRef = collection(db, "posts");
  const usersColRef = collection(db, "users");

  const [postsSnapshot, usersSnapshot] = await Promise.all([
    getDocs(postsColRef),
    getDocs(usersColRef),
  ]);

  const posts = postsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const users = usersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Posts by category
  const categoryCounts = {};
  posts.forEach((post) => {
    const category = post.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  // Posts by location
  const locationCounts = {};
  posts.forEach((post) => {
    const location = post.location || "Unknown";
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  // User growth over time (by month)
  const userGrowth = {};
  users.forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      userGrowth[monthYear] = (userGrowth[monthYear] || 0) + 1;
    }
  });

  // User status distribution
  const userStatusDistribution = {
    active: users.filter((u) => !u.inactive).length,
    inactive: users.filter((u) => u.inactive).length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  return {
    postsByCategory: Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
    })),
    postsByLocation: Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10), // Top 10 locations
    userGrowth: Object.entries(userGrowth)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    userStatusDistribution,
  };
};

// ADMIN-SPECIFIC USER MANAGEMENT FUNCTIONS

// Update user details (admin function)
export const updateUserDetails = async (userId, updatedData) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, ...updatedData };
};

// Get user by ID (admin function)
export const getUserById = async (userId) => {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Update user role (admin function)
export const updateUserRole = async (userId, newRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    role: newRole,
    userType: newRole, // Also update userType for backwards compatibility
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, role: newRole };
};

// Deactivate/Activate user (admin function)
export const toggleUserStatus = async (userId, isActive) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    inactive: !isActive,
    updatedAt: new Date().toISOString(),
  });
  return { id: userId, inactive: !isActive };
};

// REVIEW OPERATIONS

// Create a new review
export const createReview = async (reviewData) => {
  const colRef = collection(db, "reviews");
  const docRef = await addDoc(colRef, {
    ...reviewData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef;
};

// Get reviews by post ID
export const getReviewsByPost = async (postId) => {
  const colRef = collection(db, "reviews");
  const snapshot = await getDocs(colRef);
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return reviews.filter((review) => review.postId === postId);
};

// Get reviews by user ID (reviews written by user)
export const getReviewsByUser = async (userId) => {
  const colRef = collection(db, "reviews");
  const snapshot = await getDocs(colRef);
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return reviews.filter((review) => review.reviewerId === userId);
};

// Get reviews received by user (reviews on their posts)
export const getReviewsReceivedByUser = async (userId) => {
  // First get all posts by the user
  const userPosts = await getPostsByOwner(userId);
  const postIds = userPosts.map(post => post.id);
  
  // Then get all reviews for those posts
  const colRef = collection(db, "reviews");
  const snapshot = await getDocs(colRef);
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return reviews.filter((review) => postIds.includes(review.postId));
};

// Update a review
export const updateReview = async (reviewId, updatedData) => {
  const docRef = doc(db, "reviews", reviewId);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
  return { id: reviewId, ...updatedData };
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const docRef = doc(db, "reviews", reviewId);
  return await deleteDoc(docRef);
};

// Get all reviews (admin function)
export const getAllReviews = async () => {
  const colRef = collection(db, "reviews");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Update post review statistics
export const updatePostReviewStats = async (postId) => {
  try {
    const reviews = await getReviewsByPost(postId);
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
      : 0;

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      reviewCount: reviewCount,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      updatedAt: new Date().toISOString(),
    });

    return { reviewCount, averageRating };
  } catch (error) {
    console.error("Error updating post review stats:", error);
    throw error;
  }
};

// Update user review statistics
export const updateUserReviewStats = async (userId) => {
  try {
    const reviewsReceived = await getReviewsReceivedByUser(userId);
    const totalReviews = reviewsReceived.length;
    const averageRating = totalReviews > 0 
      ? reviewsReceived.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      totalReviews: totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      updatedAt: new Date().toISOString(),
    });

    return { totalReviews, averageRating };
  } catch (error) {
    console.error("Error updating user review stats:", error);
    throw error;
  }
};