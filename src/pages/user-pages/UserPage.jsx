import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  getPostsByOwner,
  getDeclinedPostsByOwner,
  deletePost,
  getReviewsReceivedByUser,
} from "../../firebase/dbService";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getInitials,
  getDisplayName,
  getProfileImageUrl,
  hasProfileImage,
} from "../../utils/profileUtils";
import EditPostModal from "../../components/EditPostModal";

const UserPage = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [declinedPosts, setDeclinedPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle URL query parameters for tab navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");

    // Valid tabs
    const validTabs = ["posts", "drafts", "declined", "reviews"];

    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      // Default to posts if no valid tab parameter
      setActiveTab("posts");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userProfile) {
        try {
          // Fetch detailed profile data
          const profileData = await getUserProfile(user.uid);
          setProfile(profileData);

          // Fetch user's posts
          const userPosts = await getPostsByOwner(user.uid);
          const declinedPostsData = await getDeclinedPostsByOwner(user.uid);
          setPosts(
            userPosts.filter(
              (post) => post.status !== "draft" && post.status !== "declined"
            )
          );
          setDrafts(userPosts.filter((post) => post.status === "draft"));
          setDeclinedPosts(declinedPostsData);

          // Fetch reviews received by the user
          const reviewsData = await getReviewsReceivedByUser(user.uid);
          setReviews(reviewsData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, userProfile]);

  const formatMemberSince = (createdAt) => {
    if (!createdAt) return "December 28, 2018";
    const date = new Date(createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRent = (rent) => {
    if (rent === undefined || rent === null || isNaN(rent)) {
      return "Rent not set";
    }
    return `Rs. ${rent.toLocaleString()}/=`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Pending
          </div>
        );
      case "approved":
        return (
          <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Approved
          </div>
        );
      case "declined":
        return (
          <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Declined
          </div>
        );
      default:
        return null;
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleEditSuccess = async () => {
    // Refresh posts data
    try {
      const userPosts = await getPostsByOwner(user.uid);
      const declinedPostsData = await getDeclinedPostsByOwner(user.uid);
      setPosts(
        userPosts.filter(
          (post) => post.status !== "draft" && post.status !== "declined"
        )
      );
      setDrafts(userPosts.filter((post) => post.status === "draft"));
      setDeclinedPosts(declinedPostsData);
    } catch (error) {
      console.error("Error refreshing posts:", error);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
  };

  const handleDeletePost = (post) => {
    setDeletingPost(post);
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    if (!deletingPost) return;

    try {
      setDeleting(true);

      // Delete post and all associated images (handled in deletePost function)
      await deletePost(deletingPost.id);

      // Refresh posts data
      const userPosts = await getPostsByOwner(user.uid);
      const declinedPostsData = await getDeclinedPostsByOwner(user.uid);
      setPosts(
        userPosts.filter(
          (post) => post.status !== "draft" && post.status !== "declined"
        )
      );
      setDrafts(userPosts.filter((post) => post.status === "draft"));
      setDeclinedPosts(declinedPostsData);

      // Close modal and reset state
      setShowDeleteModal(false);
      setDeletingPost(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingPost(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://media.craiyon.com/2025-08-19/fNJtbLg-QeaVwd0OpPtrww.webp')",
          }}
        ></div>

        {/* Edit Profile Button */}
        <Link
          to="/user/edit"
          className="absolute md:top-34 top-15 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit Profile
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-16 mb-6">
                {hasProfileImage(profile) ? (
                  <img
                    src={getProfileImageUrl(profile)}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {getInitials(profile.firstName, profile.lastName)}
                    </span>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                {getDisplayName(profile, "User")}
              </h1>

              {/* About Me Section */}
              <div className="border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">About me</h3>
                  
                  
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile.description ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                </p>
              </div>

              {/* Location Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
                  {profile.address ||
                    "Level 5, Hemas House No 75 Bray-brooke place, Colombo 02"}
                </p>
              </div>

              {/* Member Since */}
              <div>
                <p className="text-gray-600 text-sm">
                  Member since: {formatMemberSince(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => {
                      setActiveTab("posts");
                      navigate("/user?tab=posts", { replace: true });
                    }}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "posts"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Posts
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("drafts");
                      navigate("/user?tab=drafts", { replace: true });
                    }}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "drafts"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Drafts
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("declined");
                      navigate("/user?tab=declined", { replace: true });
                    }}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "declined"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Declined Posts
                    {declinedPosts.length > 0 && (
                      <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                        {declinedPosts.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("reviews");
                      navigate("/user?tab=reviews", { replace: true });
                    }}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Reviews
                  </button>
                </div>

                {activeTab === "reviews" && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Review
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "posts" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            post.images && post.images[0]
                              ? post.images[0]
                              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNFNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+"
                          }
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          {getStatusIcon(post.status)}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Edit post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Delete post"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {formatRent(post.rent)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Create New Post Card */}
                  <Link
                    to="/post-add"
                    className="bg-white border-2 border-blue-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Create new post</p>
                  </Link>
                </div>
              )}

              {activeTab === "drafts" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {drafts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={
                            post.images && post.images[0]
                              ? post.images[0]
                              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNFNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+"
                          }
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="bg-blue-600 text-white p-1 rounded">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="bg-blue-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Edit draft"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post)}
                            className="bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white p-1 rounded transition-all"
                            title="Delete draft"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {formatRent(post.rent)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Create More Posts Card */}
                  <Link
                    to="/post-add"
                    className="bg-white border-2 border-blue-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">
                      Create more posts
                    </p>
                  </Link>
                </div>
              )}

              {activeTab === "declined" && (
                <div className="space-y-6">
                  {declinedPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Declined Posts
                      </h3>
                      <p className="text-gray-500">
                        All your posts have been approved or are still pending
                        review.
                      </p>
                    </div>
                  ) : (
                    declinedPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center flex-shrink-0">
                            {post.imageUrls && post.imageUrls.length > 0 ? (
                              <img
                                src={post.imageUrls[0]}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                className="w-16 h-16 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                />
                              </svg>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-bold text-[#263D5D]">
                                    {post.title}
                                  </h3>
                                  {getStatusIcon(post.status)}
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    <span className="text-sm">
                                      {post.location}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-sm bg-[#3ABBD0]/10 text-[#3ABBD0] px-3 py-1 rounded-full">
                                      {post.category}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-sm">
                                      Declined:{" "}
                                      {new Date(
                                        post.declinedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[#263D5D] font-bold text-lg">
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                      />
                                    </svg>
                                    <span>
                                      Rs. {post.rent?.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                  {post.description}
                                </p>

                                {/* Decline Reason */}
                                {post.declineReason && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                      <svg
                                        className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                      </svg>
                                      <div>
                                        <h4 className="font-semibold text-red-800 mb-1">
                                          Reason for Decline
                                        </h4>
                                        <p className="text-red-700 text-sm">
                                          {post.declineReason}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex lg:flex-col gap-3">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  <span>Edit & Resubmit</span>
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Reviews Yet
                      </h3>
                      <p className="text-gray-500">
                        You haven't received any reviews on your properties yet.
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#3ABBD0]/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-[#3ABBD0]">
                                {review.reviewerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.reviewerName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        <p className="text-gray-700 mb-4">{review.reviewText}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        post={editingPost}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Post
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {deletingPost && (
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete this post?
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {deletingPost.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {deletingPost.location} • {deletingPost.category}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
