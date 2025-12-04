CREATE TABLE media_items (
  id INT PRIMARY KEY,
  imdb VARCHAR(15),
  title VARCHAR(255) NOT NULL,
  duration VARCHAR(50),
  rating DECIMAL,
  coverurl TEXT,
  description TEXT,
  type VARCHAR(20),
  dateviewed DATE,
  year VARCHAR(5),
  category VARCHAR(20),
  genre VARCHAR(50),
  seasonnumber int,
  episodenumber int
);

INSERT INTO media_items (
  id,
  imdb,
  title,
  duration,
  rating,
  coverurl,
  description,
  type,
  dateviewed,
  category,
  genre,
  year,
  seasonnumber,
  episodenumber
)
VALUES (
  1,
  'tt0903747',
  'Breaking Bad',
  '2h 15min',
  4.5,
  'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_.jpg',
  'A thrilling journey through space and time that challenges our understanding of reality.',
  'movie',
  '2025-10-15',
  'viewed',
  'Sci-Fi',
  '2010',
  5,
  12
);