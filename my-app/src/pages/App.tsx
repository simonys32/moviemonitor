import { useState } from 'react';
import '../App.css';
import { useMovieData } from '../hooks/useMovieData';
import { useMediaActions } from '../hooks/useMediaActions';
import { MovieSection } from '../components/MovieSection';
import { AddMovieModal } from '../components/AddMovieModal';
import { Navigation } from '../components/Navigation';
import { Notification } from '../components/Notification';
import { CATEGORIES, API_BASE_URL, API_ENDPOINTS } from '../constants';

type Category = 'viewed' | '2watch';

interface AppProps {
  onLogout: () => void;
}

function App({ onLogout }: AppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mediaItems, refreshData } = useMovieData();
  const { notification, handleRatingChange, handleDateChange, handleMarkAsWatched } = useMediaActions(refreshData);

  const categories = CATEGORIES as unknown as { id: Category; title: string }[];

  const sections = categories.map(category => ({
    title: category.title,
    items: mediaItems.filter(item => item.category === category.id)
  }));

  const [addNotification, setAddNotification] = useState<string | null>(null);

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

      {sections.map((section, index) =>
        section.items.length > 0 && (
          <MovieSection 
            key={index} 
            section={section} 
            index={index} 
            onRatingChange={handleRatingChange}
            onMarkAsWatched={handleMarkAsWatched}
            onDateChange={handleDateChange}
          />
        )
      )}

      <AddMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMovie}
      />

      <Notification message={notification} />
      <Notification message={addNotification} />
    </div>
  );
}

export default App;
