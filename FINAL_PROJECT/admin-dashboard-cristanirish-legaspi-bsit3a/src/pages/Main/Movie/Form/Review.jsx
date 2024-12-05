import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const { movieId } = useParams(); 
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/movies/${movieId}`);
        setMovie(response.data);

        const tmdbId = response.data.tmdbId;
        if (tmdbId) {
          await fetchMovieExtras(tmdbId);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMovieExtras = async (tmdbId) => {
      try {
        const apiKey = "0174e9e2006869bcf044f890f49d7057"; 
        const baseApiUrl = `https://api.themoviedb.org/3/movie/${tmdbId}`;
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer  eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTc0ZTllMjAwNjg2OWJjZjA0NGY4OTBmNDlkNzA1NyIsIm5iZiI6MTczMzI5ODU4Ny4wMTgsInN1YiI6IjY3NTAwOTliOWJlZTY0NjljMTQ1NzFlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._IBJtymwYBwB4GY3s7hLSKhtVaGjO0avfuxzE8pguWE`, // Replace with TMDb access token
        };

        
        const castResponse = await axios.get(`${baseApiUrl}/credits`, { headers });
        setCast(castResponse.data.cast.slice(0, 10)); // 

        
        const photosResponse = await axios.get(`${baseApiUrl}/images`, { headers });
        setPhotos(photosResponse.data.backdrops.slice(0, 5)); 

        
        const videosResponse = await axios.get(`${baseApiUrl}/videos`, { headers });
        setVideos(videosResponse.data.results);
      } catch (error) {
        console.error("Error fetching movie extras:", error);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    } else {
      setError("No movie ID provided.");
      setLoading(false);
    }
  }, [movieId]);

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <div>{error}</div>;

  const posterUrl = movie?.posterPath
    ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  return (
    <div className="review-container">
      <h1>{movie.title} - Review</h1>
      <div className="movie-details">
        <img src={posterUrl} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <p><strong>Overview:</strong> {movie.overview || "No overview available"}</p>
          <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString() || "Unknown"}</p>
          <p><strong>Popularity:</strong> {movie.popularity?.toFixed(2) || "N/A"}</p>
          <p><strong>Vote Average:</strong> {movie.voteAverage ? `${movie.voteAverage}/10` : "Not rated"}</p>
          <p><strong>Total Votes:</strong> {movie.voteCount || "N/A"}</p>
        </div>
      </div>

      {}
      <div className="extras">
        <h2>Cast</h2>
        <ul className="cast-list">
          {cast.map((actor) => (
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

      {}
      <div className="extras">
        <h2>Photos</h2>
        <div className="photos">
          {photos.map((photo) => (
            <img
              key={photo.file_path}
              src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
              alt="Movie Photo"
            />
          ))}
        </div>
      </div>

      {}
      <div className="extras">
        <h2>Videos</h2>
        <ul className="video-list">
          {videos.map((video) => (
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

      <button onClick={() => navigate(-1)} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Review;
