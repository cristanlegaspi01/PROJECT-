import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [query, setQuery] = useState(''); 
  const [searchResults, setSearchResults] = useState([]); 
  const [isSearching, setIsSearching] = useState(false); 
  const [topMovies, setTopMovies] = useState([]); 
  const [isCastSelected, setIsCastSelected] = useState(false); 

  const apiKey = '0174e9e2006869bcf044f890f49d7057'; 

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    navigate('/'); 
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/'); 
    } else {
      
      if (!window.location.pathname.includes('/main/home')) {
        navigate('/main/home'); 
      }
    }
  }, [accessToken, navigate]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]); //
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(response.data.results || []); 
    } catch (error) {
      console.error('Error searching for movies/cast:', error);
      setSearchResults([]); 
    } finally {
      setIsSearching(false); 
    }
  };

  const handleSearchResultClick = async (result) => {
    if (result.media_type === 'movie') {
      navigate(`/main/view/${result.id}`); 
    } else if (result.media_type === 'person') {
      setIsCastSelected(true);
      setQuery(''); 
      setSearchResults([]); 
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${result.id}/movie_credits?api_key=${apiKey}`
        );
        setTopMovies(response.data.cast.slice(0, 7)); // Set top 7 movies for the cast
      } catch (error) {
        console.error('Error fetching movies for cast:', error);
      }
    }
  };

  const clearCastMovies = () => {
    setIsCastSelected(false);
    setTopMovies([]); 
  };

  const renderCastMovies = () => {
    return (
      <div className="cast-movies">
        <h3>Top Movies</h3>
        {topMovies.length > 0 ? (
          <ul>
            {topMovies
              .filter((movie) => movie.poster_path) 
              .map((movie) => (
                <li key={movie.id}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
                </li>
              ))}
          </ul>
        ) : (
          <p>No top movies available</p>
        )}
      </div>
    );
  };

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/main/home')}>Movies</a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <button className='logout-btn' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/')}>Login</a>
              </li>
            )}
          </ul>
        </div>

        {}
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search for movies or cast...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Search Results */}
        <div className='search-results'>
          {isSearching && <p>Loading...</p>}
          {searchResults.length > 0 &&
            searchResults.map((result) => (
              <div
                key={result.id}
                className='search-result-item'
                onClick={() => handleSearchResultClick(result)}
              >
                <img
                  src={
                    result.media_type === 'movie'
                      ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
                      : result.profile_path
                      ? `https://image.tmdb.org/t/p/w200${result.profile_path}`
                      : 'https://via.placeholder.com/100x150?text=No+Image'
                  }
                  alt={result.title || result.name}
                />
                <p>{result.title || result.name}</p>
                <small>{result.media_type === 'movie' ? 'Movie' : 'Cast Member'}</small>
              </div>
            ))}
          {!isSearching && searchResults.length === 0 && query && (
            <p>No results found for "{query}"</p>
          )}
        </div>

        {}
        {isCastSelected && renderCastMovies()}

        {}
        {isCastSelected && (
          <button className="clear-cast-btn" onClick={clearCastMovies}>
            Clear Cast Movies
          </button>
        )}

        <div className='outlet'>
          <Outlet /> {}
        </div>
      </div>
    </div>
  );
}

export default Main;
