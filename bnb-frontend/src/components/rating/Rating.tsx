import React from "react";

interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const validRating = typeof rating === "number" && rating > 0 ? rating : 0;
  const fullStars = Math.floor(validRating);
  const halfStar = validRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <span className="text-yellow-400 font-bold mr-1">
        {validRating.toFixed(1)}
      </span>
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400">
          &#9733;
        </span>
      ))}
      {halfStar && <span className="text-yellow-400">&#9733;</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          &#9734;
        </span>
      ))}
    </div>
  );
};

export default Rating;
