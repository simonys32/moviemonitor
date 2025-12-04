import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import axios from 'axios';
import postgres from 'postgres'
import supabase from './config/supabaseconfig.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import loadingTitles from './testmovies.js';

const app = express();

// Allow requests from the frontend dev server
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://moviemonitor-server.vercel.app',
    'https://moviemonitor-simon.vercel.app'
  ],
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

async function fetchMediaItems() {
  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*')
    
    if (error) {
      console.error(' Error fetching media items:', error.message);
      return null;
    }
    
   /*  console.log(' Successfully fetched media items:', data.length, 'items'); */
    return data;
  } catch (err) {
    console.error(' Failed to fetch media items:', err.message);
    return null;
  }
}

async function fetchImdbFromApi(title, category) {
  if (!process.env.omdb_apikey) {
    console.warn('OMDB API key not configured (omdb_apikey)');
    return null;
  }
  const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.omdb_apikey}`;
  const response = await axios.get(apiUrl);
    
    if (response.data.Response === 'False') {
      console.log(`OMDB API: ${response.data.Error}`);
      console.log(title)
      return null;
    }

    const omdbData = response.data;
    
    let year = omdbData.Year || '';
    if (year && year.includes('–')) {
      year = year.split('–')[0];
    }
 
    const mediaItem = {
      id: omdbData.imdbID ? parseInt(omdbData.imdbID.substring(2)) : null,
      imdb: omdbData.imdbID || '',
      title: omdbData.Title || '',
      duration: omdbData.Runtime || '',
      rating: omdbData.imdbRating ? parseFloat(omdbData.imdbRating) : 0,
      coverurl: omdbData.Poster && omdbData.Poster !== 'N/A' ? omdbData.Poster : '' ,
      description: omdbData.Plot || '',
      type: omdbData.Type === 'series' ? 'show' : 'movie',
      dateviewed: category === 'viewed' ? new Date().toISOString() : null,
      year: year,
      category: category || 'viewed',
      genre: omdbData.Genre || '',
      seasonnumber: omdbData.Type === 'series' ? parseInt(omdbData.totalSeasons) || null : null,
      episodenumber: null
    };

    const { data: existingItem, error: queryError } = await supabase
      .from('media_items')
      .select('*')
      .eq('imdb', mediaItem.imdb)
      .single();
    if (!existingItem) {
      const { data: insertedItem, error: insertError } = await supabase
        .from('media_items')
        .insert([mediaItem]);
      
      if (insertError) {
        console.error('Error inserting media item:', insertError.message);
        console.log(mediaItem);
      } 
    } else {
      const { error: updateError } = await supabase
        .from('media_items')
        .update({ 
          dateviewed: new Date().toISOString(),
          category: 'viewed'
        })
        .eq('imdb', mediaItem.imdb);
      
      if (updateError) {
      console.error('Error updating dateviewed:', updateError.message);
    }
  }
}async function loadMovies() {
  console.log('Loading movies from loadingTitles...');
  for (const item of loadingTitles) {
    await fetchImdbFromApi(item.title, item.category);
  }
  console.log('Finished loading movies');
}

/* loadMovies();  */


app.post('/submitmovie', async (req, res) => {
  const { movieName, category } = req.body;    
  const result = await fetchImdbFromApi(movieName, category || 'viewed');
  if (result === null) {
    return res.status(400).json({ error: 'Movie submission failed' });
  }
  res.json({ message: 'Movie submission successful', movieName, category });
});


app.post('/updaterating', async (req, res) => {
  const { id, personalRating } = req.body;
  const { data, error } = await supabase
    .from('media_items')
    .update({ personalrating: personalRating })
    .eq('imdb', id);  
  if (error) {  
    return res.status(400).json({ error: 'Failed to update rating' });  
  }  
  res.json({ message: 'Rating updated successfully', id, personalRating });
});

app.post('/markwatched', async (req, res) => {
  const { imdb } = req.body;
  const { data, error } = await supabase
    .from('media_items')
    .update({ 
      category: 'viewed',
      dateviewed: new Date().toISOString()
    })
    .eq('imdb', imdb);
  
  if (error) {
    return res.status(400).json({ error: 'Failed to mark as watched' });
  }
  res.json({ message: 'Marked as watched successfully' });
});

app.post('/updatedate', async (req, res) => {
  const { imdbId, dateviewed } = req.body;
  const { data, error } = await supabase
    .from('media_items')
    .update({ dateviewed })
    .eq('imdb', imdbId);
  
  if (error) {
    return res.status(400).json({ error: 'Failed to update date' });
  }
  res.json({ message: 'Date updated successfully' });
});

app.post('/deletemedia', async (req, res) => {
  const { imdb } = req.body;
  
  const { data, error } = await supabase
    .from('media_items')
    .delete()
    .eq('imdb', imdb);
  
  if (error) {
    return res.status(400).json({ error: 'Failed to delete media item' });
  }
  
  res.json({ message: 'Media item deleted successfully' });
});

app.get('/data', async (req, res) => {
  const result = await fetchMediaItems();
  
  if (result) {
    res.json(result);
  } else {
    res.status(500).json({ error: 'Failed to fetch media items' });
  }
});

// Export the Express app for Vercel
export default app;

// Only start the server if running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
