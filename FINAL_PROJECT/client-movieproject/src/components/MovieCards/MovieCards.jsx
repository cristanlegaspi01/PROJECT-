import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCards.css';

function MovieCards({ movie }) {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle clicking on the movie card to go to the movie view
  const handleCardClick = () => {
    navigate(`/main/view/${movie.id}`); // Navigate to the movie detail page using the movie ID
  };

  return (
    <div className="card">
      {/* Movie Card View */}
      <div className="card-image" onClick={handleCardClick}>
        <img src={movie.posterPath} alt={movie.title} />
        <div className="play-button">
          <i className="fas fa-play"></i> {/* Play icon for hover effect */}
        </div>
        <div className="content">
          <h3>{movie.title}</h3>
          <p className="release-date">{movie.releaseDate}</p>
          <p className="rating">⭐ {movie.voteAverage}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieCards;
