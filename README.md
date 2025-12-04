# Movie Monitor

A full-stack web application for tracking movies and TV shows you've watched or want to watch. Includes a Chrome extension that automatically adds movies and TV shows you are currently watching to the library.
<img width="350" height="200" alt="image" src="https://github.com/user-attachments/assets/c422abda-23fb-44a4-adcf-4e2692af0cbe" />

<img width="350" height="200" alt="image" src="https://github.com/user-attachments/assets/af333b9e-2355-4bd8-accf-df46f0efd3e5" />


##  Features

- **Track Movies & Shows**: Add movies and TV shows to your personal collection
- **Smart Data Fetching**: Automatically fetches movie details from OMDB API
- **Personal Ratings**: Rate movies with your own personal score
- **Watch Categories**: Organize media into "viewed" and "watchlist" categories
- **Chrome Extension**: Submit movies directly from supported streaming sites
- **Persistent Storage**: All data stored in Supabase database

## Project Structure

```
MovieMonitor/
├── backend/server/          # Express.js backend API
├── my-app/                  # React + TypeScript frontend
└── MovieMonitor/            # Chrome extension 
```

## Live Deployment

- **Frontend**: https://moviemonitor-simon.vercel.app

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OMDB API key

### Backend Setup 

1. Navigate to the backend directory:
   ```bash
   cd backend/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` with:
   ```
   omdb_apikey=your_omdb_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8080`


### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `MovieMonitor` directory
5. The extension is now installed and ready to use



## API Endpoints

- `GET /data` - Fetch all media items
- `POST /submitmovie` - Add a new movie/show
- `POST /updaterating` - Update personal rating
- `POST /markwatched` - Mark item as watched
- `POST /updatedate` - Update view date
- `POST /deletemedia` - Delete media item

## Database Schema

The application uses a Supabase PostgreSQL database with a `media_items` table containing:
- `id` - Unique identifier
- `imdb` - IMDB ID
- `title` - Movie/show title
- `type` - "movie" or "show"
- `rating` - IMDB rating
- `personalrating` - User's personal rating
- `category` - "viewed" or "watchlist"
- `dateviewed` - Date watched
- `coverurl` - Poster image URL
- `description` - Plot summary
- `genre` - Genre(s)
- `year` - Release year
- `duration` - Runtime
- `seasonnumber` - Number of seasons (for shows)

## Environment Variables

### Backend
- `omdb_apikey` - Your OMDB API key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key

### Frontend
Automatically detects environment (dev vs production) using Vite's `import.meta.env.PROD`

