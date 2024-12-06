import { Outlet } from 'react-router-dom';
import Home from './Home'; 
import './Movie.css'; 

const Movie = () => {
  return (
    <div className="movie-page">
      <header className="movie-header">
        <h1 className="movie-title">Movie Page</h1>
      </header>

      <main className="movie-main">
        {}
        <Home />
        
        {}
        <Outlet />
      </main>
    </div>
  );
};

export default Movie;
