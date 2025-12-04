import { LOOKMOVIE_URLS } from './constants';
import type { MediaItem, MediaType } from './types';

export const formatDuration = (duration: string) => {
  const minutes = parseInt(duration?.replace(/\D/g, '') || '0');
  if (!minutes) return '';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

export const formatFullDate = (dateString: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const getLookMovieUrl = (type: MediaType): string => {
  return type === 'movie' ? LOOKMOVIE_URLS.MOVIE : LOOKMOVIE_URLS.SHOW;
};

export const formatMediaDuration = (item: MediaItem): string => {
  if (item.type === 'show') {
    if (item.seasonnumber) {
      return `${item.seasonnumber} Season${item.seasonnumber !== 1 ? 's' : ''}`;
    }
    return 'N/A';
  }
  const formattedDuration = formatDuration(item.duration || '');
  return formattedDuration || 'N/A';
};
