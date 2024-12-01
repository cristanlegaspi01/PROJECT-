import React, { useState, useEffect } from "react";
import axios from "axios";

const CastAndCrew = () => {
  const [query, setQuery] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [casts, setCasts] = useState([]);
  const [name, setName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Search for movies from your database
  const handleSearch = async () => {
    setError("");
    if (!query.trim()) {
      setError("Please enter a movie title to search.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/movies/search?query=${query}`, // API endpoint to search movies
      );
      setSearchedMovies(response.data || []);
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch casts for the selected movie from the database
  useEffect(() => {
    if (selectedMovie) {
      const fetchCasts = async () => {
        setIsLoading(true);
        setError("");
        try {
          const response = await axios.get("/movies/casts"); // API to get casts for the selected movie
          setCasts(response.data);
        } catch (err) {
          setError("Failed to load casts for the selected movie.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchCasts();
    }
  }, [selectedMovie]);

  // Add a new cast member to the selected movie
  const handleAddCast = async (e) => {
    e.preventDefault();
    if (!selectedMovie) {
      setError("Please select a movie first.");
      return;
    }

    const newCast = {
      name,
      characterName,
      movieId: selectedMovie.id,
    };

    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`/movies/${selectedMovie.id}/casts`, newCast); // API endpoint to add new cast
      setCasts([...casts, response.data]);
      setName("");
      setCharacterName("");
    } catch (err) {
      setError("Failed to add cast. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Movies and Add Cast & Crew</h1>

      {/* Search Section */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Search Results */}
      <div>
        <h2>Search Results</h2>
        <ul>
          {searchedMovies.map((movie) => (
            <li key={movie.id}>
              {movie.title} ({movie.releaseDate})
              <button onClick={() => setSelectedMovie(movie)}>Select</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Movie and Add Cast Section */}
      {selectedMovie && (
        <div>
          <h2>Selected Movie: {selectedMovie.title}</h2>

          {/* Add Cast Form */}
          <form onSubmit={handleAddCast}>
            <div>
              <label>Cast Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter cast name"
              />
            </div>
            <div>
              <label>Character Name:</label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name"
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Cast"}
            </button>
          </form>

          {/* Cast List */}
          <h3>Cast List</h3>
          <ul>
            {casts.map((cast) => (
              <li key={cast.id}>
                {cast.name} as {cast.characterName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CastAndCrew;
