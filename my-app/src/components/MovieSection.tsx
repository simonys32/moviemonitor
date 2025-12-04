import React, { useRef, useState } from 'react';
import { MovieCard } from './MovieCard';
import { CAROUSEL_SCROLL_OFFSET } from '../constants';
import type { MediaItem } from '../types';

interface Section {
  title: string;
  items: MediaItem[];
}

interface MovieSectionProps {
  section: Section;
  index: number;
  onRatingChange?: (imdbId: string, newRating: number, title: string) => void;
  onMarkAsWatched?: (imdbId: string, title: string) => void;
  onDateChange?: (imdbId: string, newDate: string, title: string) => void;
}

export const MovieSection: React.FC<MovieSectionProps> = ({ section, onRatingChange, onMarkAsWatched, onDateChange }) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  React.useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [section.items]);

  const scrollRow = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const offset = (direction === 'right' ? 1 : -1) * Math.round(rowRef.current.clientWidth * CAROUSEL_SCROLL_OFFSET);
    rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
    rowRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!rowRef.current) return;
    setIsMouseDown(false);
    rowRef.current.style.cursor = '';
  };

  const handleMouseUp = () => {
    if (!rowRef.current) return;
    setIsMouseDown(false);
    rowRef.current.style.cursor = '';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    rowRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="movie-section">
      <div className="section-header">
        <h2>{section.title}</h2>
        <a href="#" className="view-all">VIEW ALL</a>
      </div>
      <div className="carousel-wrapper">
        {canScrollLeft && (
          <button
            className="nav-btn prev"
            aria-label={`Scroll ${section.title} left`}
            onClick={() => scrollRow('left')}
          >
            ‹
          </button>
        )}
        <div 
          className="movie-row" 
          ref={rowRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={updateScrollButtons}
        >
          {section.items.map(item => (
            <MovieCard key={item.id} item={item} onRatingChange={onRatingChange} onMarkAsWatched={onMarkAsWatched} onDateChange={onDateChange} />
          ))}
        </div>
        {canScrollRight && (
          <button
            className="nav-btn next"
            aria-label={`Scroll ${section.title} right`}
            onClick={() => scrollRow('right')}
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
};
