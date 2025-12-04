import { useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

export const useMediaActions = (refreshData: () => Promise<void>) => {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string, duration: number = 2000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  const handleRatingChange = async (imdb: string, newRating: number, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_RATING}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: imdb, personalRating: newRating }),
      });
      if (response.ok) {
        console.log(`Rating for "${title}" updated to ${newRating}%`);
        showNotification(`Rating for "${title}" updated to ${newRating}%!`);
        await refreshData();
      } else {
        showNotification('Failed to update rating. Please try again.', 3000);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      showNotification('Error updating rating. Please try again.', 3000);
    }
  };

  const handleDateChange = async (imdbId: string, newDate: string, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPDATE_DATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbId, dateviewed: newDate }),
      });
      
      if (response.ok) {
        console.log(`Date for "${title}" updated to ${new Date(newDate).toLocaleDateString()}`);
        showNotification(`Date for "${title}" updated!`);
        await refreshData();
      } else {
        showNotification('Failed to update date. Please try again.', 3000);
      }
    } catch (error) {
      console.error('Error updating date:', error);
      showNotification('Error updating date. Please try again.', 3000);
    }
  };

  const handleMarkAsWatched = async (imdb: string, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MARK_WATCHED}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdb }),
      });

      if (response.ok) {
        showNotification(`"${title}" marked as watched!`);
        await refreshData();
      } else {
        showNotification('Failed to mark as watched. Please try again.', 3000);
      }
    } catch (error) {
      console.error('Error marking as watched:', error);
      showNotification('Error marking as watched. Please try again.', 3000);
    }
  };

  const handleDeleteMedia = async (imdb: string, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DELETE_MEDIA}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdb }),
      });

      if (response.ok) {
        showNotification(`"${title}" deleted!`);
        await refreshData();
      } else {
        showNotification('Failed to delete media item. Please try again.', 3000);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      showNotification('Error deleting media item. Please try again.', 3000);
    }
  };

  return {
    notification,
    handleRatingChange,
    handleDateChange,
    handleMarkAsWatched,
    handleDeleteMedia,
  };
};
