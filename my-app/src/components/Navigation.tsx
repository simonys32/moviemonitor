import { Link, useLocation } from 'react-router-dom';
import { APP_TITLE, APP_SUBTITLE } from '../constants';

interface NavigationProps {
  onAddClick?: () => void;
  showAddButton?: boolean;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onAddClick, showAddButton = true, onLogout }) => {
  const location = useLocation();

  return (
    <header className="app-header">
      <h1>{APP_TITLE}</h1>
      <p>{APP_SUBTITLE}</p>
      <div className="filter-container">
        <Link to="/" className={`filter-button ${location.pathname === '/' ? 'active' : ''}`}>
          Latest
        </Link>
        <Link to="/search" className={`filter-button ${location.pathname === '/search' ? 'active' : ''}`}>
          Search
        </Link>
        {showAddButton && onAddClick && (
          <button
            className="filter-button add-button"
            onClick={onAddClick}
            aria-label="Add new movie or show"
          >
            +
          </button>
        )}
        {onLogout && (
          <button
            className="filter-button logout-button"
            onClick={onLogout}
            title="Logout"
          >
            ⏻
          </button>
        )}
      </div>
    </header>
  );
};
