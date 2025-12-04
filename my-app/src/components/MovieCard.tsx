import React, { useRef } from 'react';
import { formatFullDate, getLookMovieUrl, formatMediaDuration } from '../utils';
import { RatingDisplay } from './RatingDisplay';
import type { MediaItem } from '../types';

interface MovieCardProps {
  item: MediaItem;
  onRatingChange?: (imdb: string, newRating: number, title: string) => void;
  onMarkAsWatched?: (imdb: string, title: string) => void;
  onDateChange?: (imdb: string, newDate: string, title: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item, onRatingChange, onMarkAsWatched, onDateChange }) => {
  const lookMovieUrl = getLookMovieUrl(item.type);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeout(() => dateInputRef.current?.showPicker?.(), 0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate && onDateChange) {
      onDateChange(item.imdb, new Date(newDate).toISOString(), item.title);
    }
  };

  const handleDateBlur = () => {};
  
  return (
    <div className="movie-card">
      <div className="movie-image">
        <div className="image-link">
          <img src={item.coverurl} alt={item.title} />
          <div className="image-overlay">
            <a
              href={`${lookMovieUrl}?q=${encodeURIComponent(item.title)}`}
              target="_blank"
              className="play-button"
              aria-label={`Watch ${item.title}`}
            ></a>
          </div>
        </div>
        <span className="duration">
          {formatMediaDuration(item)}
        </span>
        <span className="type-badge">{item.type === 'movie' ? 'Movie' : 'TV Show'}</span>
      </div>
      <div className="movie-info">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <h2>{item.title}</h2>
          <span className="year">{item.year}</span>
        </div>
        <span className="genre-label">{item.genre}</span>
        <div className="rating">
          <RatingDisplay 
            rating={item.rating} 
            userRating={item.personalrating} 
            imdbId={item.imdb}
            title={item.title}
            onRatingChange={onRatingChange}
          />
        </div>
        {item.category === 'viewed' && item.dateviewed && (
          <div className="date-badge-container">
            <div className="date-badge" onClick={handleDateClick} style={{ cursor: 'pointer' }} title="Click to change date">
              <svg className="date-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{formatFullDate(item.dateviewed)}</span>
            </div>
            <input
              ref={dateInputRef}
              type="date"
              className="date-picker-hidden"
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              defaultValue={item.dateviewed ? new Date(item.dateviewed).toISOString().split('T')[0] : ''}
            />
          </div>
        )}
        {item.category === '2watch' && !item.dateviewed && onMarkAsWatched && (
          <button 
            className="watched-checkbox"
            onClick={() => onMarkAsWatched(item.imdb, item.title)}
            aria-label="Mark as watched"
          >
            <svg className="checkbox-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Mark as Watched</span>
          </button>
        )}
      </div>
    </div>
  );
};
