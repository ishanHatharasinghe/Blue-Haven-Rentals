import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createReview, updatePostReviewStats, updateUserReviewStats } from "../firebase/dbService";
import StarRating from "./StarRating";

const ReviewForm = ({ postId, postOwnerId, onReviewSubmitted, onCancel }) => {
  const { user, userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    if (!user || !userProfile) {
      setError("You must be logged in to submit a review");
      return;
    }

    if (userProfile.role === "boarding_finder" || userProfile.userType === "boarding_finder") {
      // Boarding finders can submit reviews
    } else if (userProfile.role === "boarding_owner" || userProfile.userType === "boarding_owner") {
      // Boarding owners can also submit reviews
    } else {
      setError("You must be a registered user to submit reviews");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const reviewData = {
        postId,
        reviewerId: user.uid,
        reviewerName: `${userProfile.firstName} ${userProfile.lastName}`.trim(),
        rating,
        reviewText: reviewText.trim(),
      };

      // Create the review
      await createReview(reviewData);

      // Update post review statistics
      await updatePostReviewStats(postId);

      // Update user review statistics (for the post owner)
      await updateUserReviewStats(postOwnerId);

      // Call the success callback
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#263D5D]">Write a Review</h3>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close review form"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-[#263D5D] mb-3">
            Rate this property *
          </label>
          <div className="flex items-center gap-2">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive={true}
              size="lg"
              showLabel={true}
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-[#263D5D] mb-3">
            Write your review *
          </label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this property..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3ABBD0] focus:border-[#3ABBD0] transition-colors resize-none"
            rows={4}
            maxLength={500}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {reviewText.length}/500 characters
            </span>
            <span className="text-xs text-gray-500">
              Be honest and helpful to other users
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !reviewText.trim()}
            className="flex-1 px-6 py-3 bg-[#3ABBD0] hover:bg-[#2BA9C1] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
