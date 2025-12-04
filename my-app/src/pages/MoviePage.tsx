import { useState } from 'react';
import '../App.css';
import { Navigation } from '../components/Navigation';
import { Notification } from '../components/Notification';
import { AddMovieModal } from '../components/AddMovieModal';
import { useMovieData } from '../hooks/useMovieData';
import { useMediaActions } from '../hooks/useMediaActions';
import { GENRES_WITH_ALL, API_BASE_URL, API_ENDPOINTS } from '../constants';
import { formatMediaDuration, formatFullDate, getLookMovieUrl } from '../utils';
import { RatingDisplay } from '../components/RatingDisplay';

type Category = 'viewed' | '2watch';

interface MoviePageProps {
  onLogout: () => void;
}

const MoviePage: React.FC<MoviePageProps> = ({ onLogout }) => {
  const { mediaItems, refreshData } = useMovieData();
  const { notification, handleRatingChange, handleDeleteMedia } = useMediaActions(refreshData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addNotification, setAddNotification] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ imdb: string; title: string } | null>(null);
  let filteredItems = mediaItems;
  
  if (selectedType !== 'All') {
    filteredItems = filteredItems.filter(item => item.type === selectedType);
  }
  
  const totalCount = filteredItems.length;
  
  if (selectedGenre !== 'All') {
    filteredItems = filteredItems.filter(item => 
      item.genre && item.genre.includes(selectedGenre)
    );
  }
  
  if (selectedCategory !== 'All') {
    filteredItems = filteredItems.filter(item => item.category === selectedCategory);
  }
  
  if (searchTitle.trim()) {
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
  }
  
  if (sortBy === 'yet-to-rate') {
    filteredItems = filteredItems.filter(item => 
      (!item.personalrating || item.personalrating === 0) && item.dateviewed
    );
  }
  
  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.dateviewed || 0).getTime() - new Date(a.dateviewed || 0).getTime();
      case 'rating-asc':
        return (a.personalrating || 0) - (b.personalrating || 0);
      case 'rating-desc':
        return (b.personalrating || 0) - (a.personalrating || 0);
      case 'imdb-rating-desc':
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      case 'yet-to-rate':
        return a.title.localeCompare(b.title);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'year-desc':
        return (Number(b.year) || 0) - (Number(a.year) || 0);
      case 'year-asc':
        return (Number(a.year) || 0) - (Number(b.year) || 0);
      default:
        return 0;
    }
  });

  const showAddNotification = (message: string) => {
    setAddNotification(message);
    setTimeout(() => setAddNotification(null), 3000);
  };

  const handleAddMovie = async (title: string, category: Category) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MOVIE_POST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieName: title, category }),
      });
      
      if (response.status === 400) {
        showAddNotification(`There was an issue adding "${title}". Movie not found.`);
      } else if (response.ok) {
        showAddNotification(`"${title}" added successfully!`);
        await refreshData();
      } 
    } catch (error) {
      console.error('Error adding movie:', error);
      showAddNotification('Error adding movie. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <Navigation onAddClick={() => setIsModalOpen(true)} onLogout={onLogout} />

      <div className="list-view-container">
        <div className="filters-section">
          <div className="filter-group search-group">
            <label className="filter-label">Search:</label>
            <input 
              type="text"
              className="filter-search" 
              placeholder="Filter by title..."
              value={searchTitle} 
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          
          <div className="filter-group category-filter-group">
            <button
              type="button"
              className={`category-filter-button movie ${selectedType === 'movie' ? 'active' : ''}`}
              onClick={() => setSelectedType('movie')}
              title="Movies"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
            </button>
            
            <button
              type="button"
              className={`category-filter-button tv ${selectedType === 'show' ? 'active' : ''}`}
              onClick={() => setSelectedType('show')}
              title="TV Shows"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
            </button>
            
            <button
              type="button"
              className={`category-filter-button all ${selectedType === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedType('All')}
              title="All Types"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Genre:</label>
            <select 
              className="filter-select" 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {GENRES_WITH_ALL.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group category-filter-group">
            <button
              type="button"
              className={`category-filter-button viewed ${selectedCategory === 'viewed' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('viewed')}
              title="Watched"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            
            <button
              type="button"
              className={`category-filter-button watch ${selectedCategory === '2watch' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('2watch')}
              title="Watchlist"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            
            <button
              type="button"
              className={`category-filter-button all ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
              title="All"
            >
              <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sort by:</label>
            <select 
              className="filter-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recent</option>
              <option value="rating-asc">Your Rating ↑</option>
              <option value="rating-desc">Your Rating↓</option>
              <option value="imdb-rating-desc">IMDB Rating ↓</option>
              <option value="yet-to-rate">Yet to Rate</option>
              <option value="title">Title (A-Z)</option>
              <option value="year-desc">Year (Newest)</option>
              <option value="year-asc">Year (Oldest)</option>
            </select>
          </div>
          
          <div className="results-count">
            {filteredItems.length === totalCount 
              ? `${totalCount} found `
              : `${filteredItems.length} found`
            }
          </div>
        </div>

        <div className="list-view-grid">{filteredItems.map((item) => {
            const lookMovieUrl = getLookMovieUrl(item.type);
            
            return (
              <div key={item.id} className="list-view-item">
                <div className="list-view-poster">
                  <img src={item.coverurl} alt={item.title} />
                  <a
                    href={`${lookMovieUrl}?q=${encodeURIComponent(item.title)}`}
                    target="_blank"
                    className="list-view-play"
                    aria-label={`Watch ${item.title}`}
                  >
                    ▶
                  </a>
                </div>
                
                <div className="list-view-content">
                  <div className="list-view-header">
                    <h3 className="list-view-item-title">{item.title}</h3>
                    <span className="list-view-year">{item.year}</span>
                    <button
                      className="delete-media-button"
                      onClick={() => setDeleteConfirm({ imdb: item.imdb, title: item.title })}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="list-view-meta">
                    <span className="list-view-duration">
                      {formatMediaDuration(item)}
                    </span>
                    {item.genre && <span className="list-view-genre">{item.genre}</span>}
                  </div>
                  
                  <p className="list-view-description">{item.description}</p>
                  
                  <div className="list-view-ratings-section">
                    <RatingDisplay
                      rating={item.rating || 0}
                      userRating={item.personalrating || 0}
                      imdbId={item.imdb}
                      title={item.title}
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                  
                  {item.dateviewed ? (
                    <div className="list-view-date">
                      {item.category === 'viewed' && (
                        <svg className="watched-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                       {formatFullDate(item.dateviewed)}
                    </div>
                  ) : (
                    <div className="list-view-date not-seen">
                      <svg className="not-seen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Not seen
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMovie}
      />

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete "{deleteConfirm.title}"?</h2>
            <p style={{ color: 'var(--ev-300)', marginBottom: '2rem' }}>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={() => setDeleteConfirm(null)} className="cancel-button">
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDeleteMedia(deleteConfirm.imdb, deleteConfirm.title);
                  setDeleteConfirm(null);
                }}
                className="submit-button"
                style={{ background: '#ef4444' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Notification message={notification} />
      <Notification message={addNotification} />
    </div>
  );
};

export default MoviePage;
