import React, { useState } from 'react';

type Category = 'viewed' | '2watch';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, category: Category) => void;
}

export const AddMovieModal: React.FC<AddMovieModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('viewed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, category);
      setTitle('');
      setCategory('viewed');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Movie/Show</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie or show title"
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <div className="category-buttons">
              <button
                type="button"
                className={`category-button viewed ${category === 'viewed' ? 'active' : ''}`}
                onClick={() => setCategory('viewed')}
              >
                <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Recently Viewed</span>
              </button>
              
              <button
                type="button"
                className={`category-button watch ${category === '2watch' ? 'active' : ''}`}
                onClick={() => setCategory('2watch')}
              >
                <svg className="category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Plan to Watch</span>
              </button>
            </div>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
