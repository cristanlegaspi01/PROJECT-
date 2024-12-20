import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const { movieId } = useParams(); // Get the movieId from the URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/movies/${movieId}`);
        setMovie(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movie details. Please try again later.");
      } finally {
        setLoading(false);
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
      <button onClick={() => navigate(-1)} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Review;
