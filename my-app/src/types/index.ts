// Shared type definitions for the MovieReview app

export type MediaType = 'movie' | 'show';
export type Category = 'viewed' | '2watch';

export interface MediaItem {
  id: number;
  imdb: string;
  title: string;
  duration: string;
  rating: number;
  personalrating: number;
  coverurl: string;
  description: string;
  type: MediaType;
  dateviewed: string;
  year: string;
  category: Category;
  genre: string;
  seasonnumber: number | null;
  episodenumber: number | null;
  userrating?: number;
}
