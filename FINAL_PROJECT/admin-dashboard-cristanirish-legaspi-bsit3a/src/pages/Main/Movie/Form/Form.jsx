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
  const [cast, setCast] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
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

  // Fetch movie details, cast, photos, and videos for editing
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
            poster_path: response.data.posterPath.replace(
              "https://image.tmdb.org/t/p/original/",
              ""
            ),
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

          // Fetch additional TMDb details (cast, photos, videos)
          fetchMovieExtras(response.data.tmdbId);
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);

  const fetchMovieExtras = async (tmdbId) => {
    try {
      const apiKey = "your_tmdb_api_key"; // Use your API key here
      const baseApiUrl = `https://api.themoviedb.org/3/movie/${tmdbId}`;
      const headers = {
        Accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTc0ZTllMjAwNjg2OWJjZjA0NGY4OTBmNDlkNzA1NyIsIm5iZiI6MTczMzI5ODU4Ny4wMTgsInN1YiI6IjY3NTAwOTliOWJlZTY0NjljMTQ1NzFlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._IBJtymwYBwB4GY3s7hLSKhtVaGjO0avfuxzE8pguWE", // Replace with actual access token
      };

      // Fetch cast
      const castResponse = await axios.get(`${baseApiUrl}/credits`, { headers });
      setCast(castResponse.data.cast.slice(0, 10)); // Show top 10 cast members

      // Fetch photos
      const photosResponse = await axios.get(`${baseApiUrl}/images`, { headers });
      setPhotos(photosResponse.data.backdrops.slice(0, 5)); // Show top 5 photos

      // Fetch videos
      const videosResponse = await axios.get(`${baseApiUrl}/videos`, { headers });
      setVideos(videosResponse.data.results);
    } catch (error) {
      console.error("Error fetching movie extras:", error);
    }
  };

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
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTc0ZTllMjAwNjg2OWJjZjA0NGY4OTBmNDlkNzA1NyIsIm5iZiI6MTczMzI5ODU4Ny4wMTgsInN1YiI6IjY3NTAwOTliOWJlZTY0NjljMTQ1NzFlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._IBJtymwYBwB4GY3s7hLSKhtVaGjO0avfuxzE8pguWE", // Replace with actual access token
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

  return (
    <>
      <h1>{movieId ? "Edit Movie" : "Create Movie"}</h1>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}

      {/* Search functionality for "Create Movie" */}
      {!movieId && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleSearch} disabled={isLoading || !query.trim()}>
            Search
          </button>
        </div>
      )}

      {/* Display search results */}
      {!movieId && searchedMovieList.length > 0 && (
        <div className="search-results">
          <h2>Search Results</h2>
          <ul>
            {searchedMovieList.map((movie) => (
              <li key={movie.id} onClick={() => handleSelectMovie(movie)}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.original_title}
                />
                <div>
                  <h3>{movie.original_title}</h3>
                  <p>{movie.release_date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form for editing/creating */}
      <div className="container">
        <form onSubmit={(e) => e.preventDefault()}>
          {selectedMovie && (
            <img
              className="poster-image"
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
            />
          )}
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter movie title"
            />
          </div>
          <div className="form-field">
            <label htmlFor="overview">Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Enter movie overview"
            />
          </div>
          <div className="form-field">
            <label htmlFor="popularity">Popularity</label>
            <input
              type="number"
              name="popularity"
              value={formData.popularity}
              onChange={handleInputChange}
              placeholder="Enter movie popularity"
            />
          </div>
          <div className="form-field">
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="voteAverage">Vote Average</label>
            <input
              type="number"
              name="voteAverage"
              value={formData.voteAverage}
              onChange={handleInputChange}
              placeholder="Enter movie vote average"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
            >
              {movieId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* Show Cast, Photos, and Videos when editing */}
      {movieId && (
        <>
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

          <div className="extras">
            <h2>Videos</h2>
            <ul>
              {videos.map((video) => (
                <li key={video.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {video.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Form;