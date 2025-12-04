import React, { useState, useRef, useEffect } from 'react';

interface RatingDisplayProps {
  rating: number;
  userRating?: number;
  imdbId: string;
  title: string;
  onRatingChange?: (imdbId: string, newRating: number, title: string) => void;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, userRating, imdbId, title, onRatingChange }) => {
  const imdbPercentage = rating > 0 ? Math.round((rating / 10) * 100) : 0;
  const currentUserRating = userRating ?? 0;
  const hasUserRating = currentUserRating > 0;
  const [isEditing, setIsEditing] = useState(false);
  const [tempRating, setTempRating] = useState(currentUserRating.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const hasImdbRating = rating > 0;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    const numValue = Math.min(Math.max(parseInt(tempRating) || 0, 0), 100);
    if (onRatingChange && numValue !== currentUserRating) {
      onRatingChange(imdbId, numValue, title);
    }
    setTempRating(numValue.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempRating(currentUserRating.toString());
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    setIsEditing(true);
    setTempRating(currentUserRating.toString());
  };
  
  return (
    <div className="rating-bars">
      
      <div className="rating-bar">
        <span className="rating-label">You</span>
        <div 
          className="rating-bar-bg" 
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          title="Click to edit your rating"
        >
          <div 
            className="rating-bar-fill user" 
            style={{ 
              width: hasUserRating ? `${currentUserRating}%` : '100%',
              justifyContent: hasUserRating ? 'flex-end' : 'center'
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                min="0"
                max="100"
                value={tempRating}
                onChange={(e) => setTempRating(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="rating-input"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              hasUserRating ? `${currentUserRating}%` : 'N/A'
            )}
          </div>
        </div>
      </div>
      <div className="rating-bar">
        <span className="rating-label">IMDb</span>
        <div className="rating-bar-bg">
          <div 
            className="rating-bar-fill imdb" 
            style={{ width: hasImdbRating ? `${imdbPercentage}%` : '100%' }}
          >
            {hasImdbRating ? `${imdbPercentage}%` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
