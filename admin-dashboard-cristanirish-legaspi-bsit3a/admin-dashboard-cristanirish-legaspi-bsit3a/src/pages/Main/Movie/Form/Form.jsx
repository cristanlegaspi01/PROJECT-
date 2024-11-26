import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    popularity: "",
    releaseDate: "",
    voteAverage: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let { movieId } = useParams();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    setError("");
    if (!query) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setSearchedMovieList([]);

    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI",
      },
    })
      .then((response) => {
        if (response.data.results.length === 0) {
          setError("No movies found matching your search");
        } else {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(() => {
        setError("Unable to search movies at this time. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      handleSearch();
    }
  }, [currentPage, handleSearch]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title) errors.push("Title is required");
    if (!formData.overview) errors.push("Overview is required");
    if (!formData.releaseDate) errors.push("Release date is required");
    if (!formData.popularity) errors.push("Popularity is required");
    if (!formData.voteAverage) errors.push("Vote average is required");
    if (!selectedMovie) errors.push("Please select a movie from search results");
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);
    setError("");

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to perform this action");
      setIsLoading(false);
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: formData.title,
      overview: formData.overview,
      popularity: parseFloat(formData.popularity),
      releaseDate: formData.releaseDate,
      voteAverage: parseFloat(formData.voteAverage),
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
    };

    try {
      await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      navigate("/main/movies");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        "Unable to save the movie. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = handleSave;

  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");

      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath.replace("https://image.tmdb.org/t/p/original/", ""),
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setSelectedMovie(tempData);
          setFormData({
            title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            releaseDate: response.data.releaseDate,
            voteAverage: response.data.voteAverage,
          });
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId !== undefined ? "Edit" : "Create"} Movie</h1>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}

      {movieId === undefined && (
        <>
          <div className="search-container">
            Search Movie:{" "}
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter movie title..."
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                handleSearch();
              }}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
            <div className="searched-movie">
              {searchedMovieList.map((movie) => (
                <p 
                  key={movie.id} 
                  onClick={() => handleSelectMovie(movie)}
                  className={selectedMovie?.id === movie.id ? "selected" : ""}
                >
                  {movie.original_title}
                </p>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <hr />
        </>
      )}

      <div className="container">
        <form onSubmit={(e) => e.preventDefault()}>
          {selectedMovie && (
            <img
              className="poster-image"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={formData.title}
            />
          )}
          <div className="field">
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="field">
            Overview:
            <textarea
              rows={10}
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="field">
            Popularity:
            <input
              type="number"
              name="popularity"
              value={formData.popularity}
              onChange={handleInputChange}
              disabled={isLoading}
              step="0.1"
            />
          </div>
          <div className="field">
            Release Date:
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="field">
            Vote Average:
            <input
              type="number"
              name="voteAverage"
              value={formData.voteAverage}
              onChange={handleInputChange}
              disabled={isLoading}
              step="0.1"
              min="0"
              max="10"
            />
          </div>

          <button 
            type="button" 
            onClick={movieId ? handleUpdate : handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (movieId ? "Update" : "Save")}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate("/main/movies")}
            disabled={isLoading}
            className="back-button"
          >
            Back
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
