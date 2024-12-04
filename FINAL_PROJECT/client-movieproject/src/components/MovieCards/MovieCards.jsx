import './MovieCards.css';

function MovieCards({ movie, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <img src={movie.posterPath} alt={movie.title} />
      <span>{movie.title}</span>
    </div>
  );
}

export default MovieCards;
