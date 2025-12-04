import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';
import type { MediaItem, MediaType, Category } from '../types';

export const useMovieData = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.MOVIES}`);

      if (Array.isArray(response.data)) {
        const mappedData: MediaItem[] = response.data.map((item: any) => ({
          id: item.id,
          imdb: item.imdb_id || item.imdb,
          title: item.title,
          duration: item.duration,
          rating: item.rating,
          personalrating: item.personalrating || 0,
          coverurl: item.coverurl,
          description: item.description,
          type: item.type as MediaType,
          dateviewed: item.dateviewed,
          year: item.year,
          category: item.category as Category,
          genre: item.genre,
          seasonnumber: item.seasonnumber,
          episodenumber: item.episodenumber,
          userrating: item.userrating || 85
        }));
        
        setMediaItems(mappedData.sort((a, b) => {
          const aDate = a.dateviewed ? new Date(a.dateviewed).getTime() : 0;
          const bDate = b.dateviewed ? new Date(b.dateviewed).getTime() : 0;
          
          if (aDate === 0 && bDate === 0) {
            return (b.personalrating || 0) - (a.personalrating || 0);
          }
          
          return bDate - aDate;
        }));
      } else {
        console.error('Response data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { mediaItems, refreshData: fetchData };
};
