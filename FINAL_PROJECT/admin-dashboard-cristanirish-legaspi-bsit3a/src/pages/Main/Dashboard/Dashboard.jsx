import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/movies");
        setMovies(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.classList.add(`${theme}-mode`);
  }, [theme]);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Movie Dashboard</h1>

      <div className="movie-list">
        {movies.slice(0, 5).map((movie) => (
          <div key={movie.id} className="movie-item">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => (window.location.href = `/main/movies/form/${movie.id}/review`)}
                    className="review-button"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={toggleTheme} className="mode-toggle">
        {theme === "dark" ? "🌙" : "🌞"}
      </button>
    </div>
  );
};

export default Dashboard;
