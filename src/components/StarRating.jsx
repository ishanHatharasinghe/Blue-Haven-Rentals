import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  interactive = false, 
  size = "md",
  showLabel = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (interactive) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair", 
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return labels[rating] || "";
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        const isInteractive = interactive;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!isInteractive}
            className={`${sizeClasses[size]} transition-colors ${
              isInteractive 
                ? "cursor-pointer hover:scale-110" 
                : "cursor-default"
            }`}
          >
            <Star
              className={`w-full h-full ${
                isFilled 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
      {showLabel && (
        <span className="ml-2 text-sm text-gray-600">
          {getRatingLabel(rating)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
