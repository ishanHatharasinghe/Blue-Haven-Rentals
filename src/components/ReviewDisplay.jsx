import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getReviewsByPost, deleteReview, updatePostReviewStats, updateUserReviewStats } from "../firebase/dbService";
import StarRating from "./StarRating";

const ReviewDisplay = ({ postId, postOwnerId, showAddReview = true }) => {
  const { user, userProfile, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [deletingReview, setDeletingReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviewsData = await getReviewsByPost(postId);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [postId]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      
      // Update post and user review statistics
      await updatePostReviewStats(postId);
      await updateUserReviewStats(postOwnerId);
      
      // Refresh reviews
      const reviewsData = await getReviewsByPost(postId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    // Refresh reviews
    const reviewsData = await getReviewsByPost(postId);
    setReviews(reviewsData);
  };

  const canDeleteReview = (review) => {
    if (!user) return false;
    if (isAdmin()) return true;
    return review.reviewerId === user.uid;
  };

  const canAddReview = () => {
    if (!user || !userProfile) return false;
    
    // Allow both boarding finders and boarding owners to add reviews
    const canReview = userProfile.role === "boarding_finder" || 
                     userProfile.userType === "boarding_finder" ||
                     userProfile.role === "boarding_owner" || 
                     userProfile.userType === "boarding_owner";
    
    if (!canReview) return false;
    
    // Check if user already reviewed this post
    return !reviews.some(review => review.reviewerId === user.uid);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ABBD0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#263D5D]">
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length} size="sm" />
              <span className="text-sm text-gray-600">
                {reviews.length === 1 ? "1 review" : `${reviews.length} reviews`}
              </span>
            </div>
          )}
        </div>
        
        {showAddReview && canAddReview() && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="border-t border-gray-200 pt-6">
          <ReviewForm
            postId={postId}
            postOwnerId={postOwnerId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h4>
          <p className="text-gray-500">
            Be the first to review this property and help others make informed decisions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3ABBD0]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-[#3ABBD0]">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#263D5D]">{review.reviewerName}</h4>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">{getTimeAgo(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                {canDeleteReview(review) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete review"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
                {review.updatedAt !== review.createdAt && (
                  <span className="text-xs text-gray-500">
                    Edited
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;
