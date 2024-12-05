import { useEffect, useState } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./View.css";

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId]);

  const fetchMovieDetails = async (movieId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/movies/${movieId}`);
      setMovie(response.data); // Update movie context with fetched data

      // Fetch additional movie details (e.g., cast, photos, videos)
      const tmdbId = response.data.tmdbId;
      if (tmdbId) {
        fetchMovieExtras(tmdbId);
      }
    } catch (error) {
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieExtras = async (tmdbId) => {
    try {
      const apiKey = 'your_tmdb_api_key'; // Replace with your TMDb API key
      const baseApiUrl = `https://api.themoviedb.org/3/movie/${tmdbId}`;
      const headers = {
        Accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTc0ZTllMjAwNjg2OWJjZjA0NGY4OTBmNDlkNzA1NyIsIm5iZiI6MTczMzI5ODU4Ny4wMTgsInN1YiI6IjY3NTAwOTliOWJlZTY0NjljMTQ1NzFlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._IBJtymwYBwB4GY3s7hLSKhtVaGjO0avfuxzE8pguWE`, // Replace with actual TMDb access token
      };

      // Fetch cast, photos, and videos
      const castResponse = await axios.get(`${baseApiUrl}/credits`, { headers });
      const castData = castResponse.data.cast.slice(0, 10);

      const photosResponse = await axios.get(`${baseApiUrl}/images`, { headers });
      const photosData = photosResponse.data.backdrops.slice(0, 5);

      const videosResponse = await axios.get(`${baseApiUrl}/videos`, { headers });
      const videosData = videosResponse.data.results;

      // Update movie state with fetched extras
      setMovie((prevMovie) => ({
        ...prevMovie,
        cast: castData,
        photos: photosData,
        videos: videosData,
      }));
    } catch (error) {
      console.error('Error fetching movie extras:', error);
    }
  };

  return (
    <div className="view-container">
      {loading ? (
        <p>Loading...</p>
      ) : movie ? (
        <>
          {/* Movie Banner */}
          <div className="movie-banner" style={{ backgroundImage: `url(${movie.posterPath ? `https://image.tmdb.org/t/p/original/${movie.posterPath}` : ''})` }}>
            <div className="banner-overlay">
              <h1 className="movie-title">{movie.title}</h1>
            </div>
          </div>

          {/* Movie Details */}
          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
            <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString() || 'Unknown'}</p>
            <p><strong>Popularity:</strong> {movie.popularity?.toFixed(2) || 'N/A'}</p>
            <p><strong>Vote Average:</strong> {movie.voteAverage ? `${movie.voteAverage}/10` : 'Not rated'}</p>
            <p><strong>Total Votes:</strong> {movie.voteCount || 'N/A'}</p>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div className="section">
              <h2>Cast</h2>
              <ul className="cast-list">
                {movie.cast.map((actor) => (
                  <li key={actor.cast_id} className="cast-item">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        className="cast-photo"
                      />
                    ) : (
                      <div className="no-photo">No Photo</div>
                    )}
                    <div className="cast-details">
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Videos */}
          {movie.videos && movie.videos.length > 0 && (
            <div className="section">
              <h2>Videos</h2>
              <ul className="video-list">
                {movie.videos.map((video) => (
                  <li key={video.id}>
                    <a
                      href={`https://www.youtube.com/watch?v=${video.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                        alt={video.name}
                        className="video-thumbnail"
                      />
                      <p>{video.name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Photos */}
          {movie.photos && movie.photos.length > 0 && (
            <div className="section">
              <h2>Photos</h2>
              <div className="photo-gallery">
                {movie.photos.map((photo) => (
                  <img
                    key={photo.file_path}
                    src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
                    alt="Movie Photo"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No movie data available</p>
      )}
    </div>
  );
}

export default View;
