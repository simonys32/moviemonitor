
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://moviemonitor-server.vercel.app' 
  : 'http://localhost:8080';
export const API_ENDPOINTS = {
  MOVIES: '/data',
  MOVIE_POST: '/submitmovie',
  UPDATE_RATING: '/updaterating',
  MARK_WATCHED: '/markwatched',
  UPDATE_DATE: '/updatedate',
  DELETE_MEDIA: '/deletemedia'
};

export const LOOKMOVIE_URLS = {
  MOVIE: 'https://www.lookmovie2.to/movies/search/',
  SHOW: 'https://www.lookmovie2.to/shows/search/'
};


export const CATEGORIES = [
  { id: 'viewed', title: 'Recently viewed' },
  { id: '2watch', title: 'Plan To Watch' }
] as const;

export const FILTER_TYPES = {
  LATEST: 'Latest',
  MOVIE: 'movie',
  SHOW: 'show'
} as const;

export const MEDIA_TYPES = {
  MOVIE: 'movie',
  SHOW: 'show'
} as const;

export const APP_TITLE = ' the holy medialibrary 🍿';
export const APP_SUBTITLE = 'Keep track of all shows and movies and rate them!';

export const CAROUSEL_SCROLL_OFFSET = 0.8; // 80% of row width

export const GENRES = [
  'Action',
  'Adult',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Film Noir',
  'Game Show',
  'History',
  'Horror',
  'Musical',
  'Music',
  'Mystery',
  'News',
  'Reality-TV',
  'Romance',
  'Sci-Fi',
  'Short',
  'Sport',
  'Talk-Show',
  'Thriller',
  'War',
  'Western'
] as const;

export const GENRES_WITH_ALL = ['All', ...GENRES];
