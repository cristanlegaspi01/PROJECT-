import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import "./Dashboard.css";

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/movies"); 
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch movies. Please try again later.");
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Movie Dashboard</h1>

      <div className="table-container">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Release Date</th>
              <th>Actions</th> {}
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.title}</td>
                <td>{movie.releaseDate}</td>
                <td>
                  {}
                  <button
                    onClick={() => window.location.href = `/main/movies/form/review`}
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
    </div>
  );
};

export default Dashboard;
